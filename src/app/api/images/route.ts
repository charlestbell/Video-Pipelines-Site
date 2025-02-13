import { google } from "googleapis";
import { NextResponse } from "next/server";

// Initialize Google Drive API client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function GET() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: "files(id, name, mimeType, webContentLink, thumbnailLink)",
      orderBy: "name",
    });

    const files = response.data.files;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    // Sort files numerically by the number in their filename
    const sortedFiles = files.sort((a, b) => {
      const numA = parseInt((a.name || "0").split(".")[0]);
      const numB = parseInt((b.name || "0").split(".")[0]);
      return numA - numB;
    });

    return NextResponse.json({ images: sortedFiles });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
