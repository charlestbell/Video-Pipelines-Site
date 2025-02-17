import { NextRequest } from "next/server";
import { google } from "googleapis";

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
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const isThumbnail =
      request.nextUrl.searchParams.get("thumbnail") === "true";

    const file = await drive.files.get({
      fileId: id,
      fields: "mimeType, thumbnailLink",
    });

    if (isThumbnail && file.data.thumbnailLink) {
      try {
        const thumbnailResponse = await fetch(file.data.thumbnailLink);

        if (!thumbnailResponse.ok) {
          throw new Error(
            `Thumbnail fetch failed: ${thumbnailResponse.status}`
          );
        }

        const buffer = await thumbnailResponse.arrayBuffer();

        return new Response(buffer, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch (thumbnailError) {
        console.error("Thumbnail error:", thumbnailError);
      }
    }

    const response = await drive.files.get(
      {
        fileId: id,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const stream = response.data as unknown as ReadableStream;

    return new Response(stream, {
      headers: {
        "Content-Type": file.data.mimeType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return Response.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
