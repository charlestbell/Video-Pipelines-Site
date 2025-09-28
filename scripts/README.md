# Image Sync Script

This script downloads and optimizes images from Google Drive for the portfolio website.

## Requirements

- **Node.js**: Version 18.17.0 or higher (required for Sharp image optimization)
- **npm**: Version 8 or higher
- **Google Drive API**: Service account with Drive API access

### Checking Your Node.js Version

```bash
node --version
```

If you have an older version, you can:

- Use Node Version Manager (nvm) to install Node.js 18+
- Download from [nodejs.org](https://nodejs.org/)

## How it works

1. **Cleanup**: Removes any existing `portfolio_*.jpg` files from the `public` folder
2. **Download**: Fetches all images from the configured Google Drive folder
3. **Optimize**: Uses Sharp to resize images to 1600px on the longest edge and compress to ~400KB
4. **Generate**: Creates `images.json` with metadata for the frontend

## Usage

```bash
# Run manually
npm run sync-images

# Runs automatically before build
npm run build
```

## Environment Variables Required

- `GOOGLE_CLIENT_EMAIL`: Google service account email
- `GOOGLE_PRIVATE_KEY`: Google service account private key
- `GOOGLE_DRIVE_FOLDER_ID`: ID of the Google Drive folder containing images

## Output

- Optimized images: `public/portfolio_001.jpg`, `public/portfolio_002.jpg`, etc.
- Metadata file: `public/images.json`

## Image Optimization

- **Size**: Resized to 1600px on longest edge (maintains aspect ratio)
- **Format**: Converted to JPEG with 85% quality
- **File Size**: Compressed to ~400KB or less
- **Progressive**: Uses progressive JPEG for better loading experience
