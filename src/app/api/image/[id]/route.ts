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

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = params.id;
    const isThumbnail =
      request.nextUrl.searchParams.get("thumbnail") === "true";

    // Get the file metadata with thumbnailLink
    const file = await drive.files.get({
      fileId: id,
      fields: "mimeType, thumbnailLink",
    });

    if (isThumbnail && file.data.thumbnailLink) {
      try {
        console.log("Fetching thumbnail:", file.data.thumbnailLink);
        const thumbnailResponse = await fetch(file.data.thumbnailLink);

        if (!thumbnailResponse.ok) {
          throw new Error(
            `Thumbnail fetch failed: ${thumbnailResponse.status}`
          );
        }

        const buffer = await thumbnailResponse.arrayBuffer();
        console.log("Thumbnail size:", buffer.byteLength);

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch (thumbnailError) {
        console.error("Thumbnail error:", thumbnailError);
        // Fall through to full image fetch if thumbnail fails
      }
    }

    // Get the full image content
    const response = await drive.files.get(
      {
        fileId: id,
        alt: "media",
      },
      { responseType: "stream" }
    );

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
