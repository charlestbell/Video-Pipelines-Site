import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  // Temporary diagnostic logging (remove after debugging)
  console.log('Environment check:', {
    hasEmailUser: !!process.env.EMAIL_USER,
    emailUserLength: process.env.EMAIL_USER?.length || 0,
    hasEmailPassword: !!process.env.EMAIL_APP_PASSWORD,
    emailPasswordLength: process.env.EMAIL_APP_PASSWORD?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  })

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Missing email credentials:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_APP_PASSWORD,
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { name, email, message } = await request.json()

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      // Increase timeouts for Railway's network
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000,
      socketTimeout: 30000,
      // Retry connection
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
    })

    // Verify connection before sending (with timeout)
    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Verification timeout')), 20000)
        ),
      ])
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      // Continue anyway, sometimes verify fails but send works
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'videopipelines@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      replyTo: email,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to send email:', error)

    // Return actual error in development, generic message in production
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : 'Unknown error'
        : 'Failed to send message'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
