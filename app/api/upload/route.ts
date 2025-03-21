import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily (optional, for debugging)
    const tempPath = path.join(process.cwd(), "public", file.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(tempPath, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json(
      { success: true, data: uploadResult },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
