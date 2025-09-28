// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { google } = require('googleapis')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Initialize Google Drive API client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})

const drive = google.drive({ version: 'v3', auth })

async function cleanOldImages() {
  const publicDir = path.join(process.cwd(), 'public')

  // Clean portfolio folder
  const portfolioDir = path.join(publicDir, 'portfolio')
  if (fs.existsSync(portfolioDir)) {
    const files = fs.readdirSync(portfolioDir)
    console.log('Cleaning old portfolio images...')
    let cleanedCount = 0

    for (const file of files) {
      if (file.startsWith('portfolio_')) {
        const filePath = path.join(portfolioDir, file)
        fs.unlinkSync(filePath)
        cleanedCount++
        console.log(`Removed: ${file}`)
      }
    }
    console.log(`Cleaned ${cleanedCount} old portfolio images`)
  }

  // Clean thumbnail folder
  const thumbnailDir = path.join(publicDir, 'portfolio', 'thumbnail')
  if (fs.existsSync(thumbnailDir)) {
    const files = fs.readdirSync(thumbnailDir)
    console.log('Cleaning old thumbnail images...')
    let cleanedCount = 0

    for (const file of files) {
      if (file.startsWith('thumbnail_')) {
        const filePath = path.join(thumbnailDir, file)
        fs.unlinkSync(filePath)
        cleanedCount++
        console.log(`Removed: ${file}`)
      }
    }
    console.log(`Cleaned ${cleanedCount} old thumbnail images`)
  }
}

async function downloadAndOptimizeImages() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is required')
    }

    console.log('Fetching images from Google Drive...')
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType, webContentLink)',
      orderBy: 'name',
    })

    const files = response.data.files

    if (!files || files.length === 0) {
      console.log('No images found in Google Drive folder')
      return
    }

    // Sort files numerically by the number in their filename
    const sortedFiles = files.sort((a, b) => {
      const numA = parseInt((a.name || '0').split('.')[0])
      const numB = parseInt((b.name || '0').split('.')[0])
      return numA - numB
    })

    console.log(`Found ${sortedFiles.length} images to process`)

    // Create directory structure
    const publicDir = path.join(process.cwd(), 'public')
    const portfolioDir = path.join(publicDir, 'portfolio')
    const thumbnailDir = path.join(portfolioDir, 'thumbnail')

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    if (!fs.existsSync(portfolioDir)) {
      fs.mkdirSync(portfolioDir, { recursive: true })
    }
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true })
    }

    // Process each image
    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i]
      const fileName = `portfolio_${String(i + 1).padStart(3, '0')}.jpg`
      const thumbnailFileName = `thumbnail_${String(i + 1).padStart(3, '0')}.jpg`
      const outputPath = path.join(portfolioDir, fileName)
      const thumbnailPath = path.join(thumbnailDir, thumbnailFileName)

      console.log(`Processing ${i + 1}/${sortedFiles.length}: ${file.name}`)

      try {
        // Download the image
        const response = await drive.files.get(
          {
            fileId: file.id,
            alt: 'media',
          },
          { responseType: 'stream' }
        )

        // Convert stream to buffer
        const chunks = []
        response.data.on('data', chunk => chunks.push(chunk))

        await new Promise((resolve, reject) => {
          response.data.on('end', resolve)
          response.data.on('error', reject)
        })

        const imageBuffer = Buffer.concat(chunks)

        // Optimize with sharp
        await sharp(imageBuffer)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 85,
            progressive: true,
            mozjpeg: true,
          })
          .toFile(outputPath)

        // Check file size and reduce quality if needed
        const stats = fs.statSync(outputPath)
        const fileSizeKB = stats.size / 1024

        if (fileSizeKB > 500) {
          console.log(
            `File too large (${fileSizeKB.toFixed(1)}KB), reducing quality...`
          )

          let quality = 70
          while (fileSizeKB > 500 && quality > 30) {
            await sharp(imageBuffer)
              .resize(2000, 2000, {
                fit: 'inside',
                withoutEnlargement: true,
              })
              .jpeg({
                quality: quality,
                progressive: true,
                mozjpeg: true,
              })
              .toFile(outputPath)

            const newStats = fs.statSync(outputPath)
            const newFileSizeKB = newStats.size / 1024

            if (newFileSizeKB <= 500) {
              console.log(
                `Optimized to ${newFileSizeKB.toFixed(
                  1
                )}KB with quality ${quality}`
              )
              break
            }

            quality -= 10
          }
        } else {
          console.log(`Optimized to ${fileSizeKB.toFixed(1)}KB`)
        }

        // Generate thumbnail from the optimized image
        console.log(`Generating thumbnail for ${file.name}...`)
        await sharp(outputPath)
          .resize(400, 400, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 80,
            progressive: true,
            mozjpeg: true,
          })
          .toFile(thumbnailPath)

        const thumbnailStats = fs.statSync(thumbnailPath)
        const thumbnailSizeKB = thumbnailStats.size / 1024
        console.log(`Thumbnail generated: ${thumbnailSizeKB.toFixed(1)}KB`)
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error.message)
      }
    }

    console.log('Image sync completed successfully!')

    // Generate the images.json file for the frontend
    const imagesData = sortedFiles.map((file, index) => ({
      id: `portfolio_${String(index + 1).padStart(3, '0')}`,
      name: file.name,
      filename: `portfolio_${String(index + 1).padStart(3, '0')}.jpg`,
    }))

    const imagesJsonPath = path.join(publicDir, 'images.json')
    fs.writeFileSync(
      imagesJsonPath,
      JSON.stringify({ images: imagesData }, null, 2)
    )
    console.log('Generated images.json file')
  } catch (error) {
    console.error('Error in sync-images script:', error)
    process.exit(1)
  }
}

async function main() {
  console.log('Starting image sync process...')

  await cleanOldImages()
  await downloadAndOptimizeImages()

  console.log('Image sync process completed!')
}

main().catch(console.error)
