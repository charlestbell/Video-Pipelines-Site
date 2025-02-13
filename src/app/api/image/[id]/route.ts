import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // Get the file metadata to verify it exists and get its MIME type
    const file = await drive.files.get({
      fileId: id,
      fields: "mimeType",
    });

    // Get the file content
    const response = await drive.files.get(
      {
        fileId: id,
        alt: "media",
      },
      { responseType: "stream" }
    );

    // Convert the readable stream to a Response
    const stream = response.data as unknown as ReadableStream;

    return new NextResponse(stream, {
      headers: {
        "Content-Type": file.data.mimeType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
