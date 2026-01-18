import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const language = formData.get("language") as string || "eng";

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempFilePath = path.join("/tmp", `upload_${Date.now()}_${file.name}`);
  
  try {
    await writeFile(tempFilePath, buffer);

    const { stdout, stderr } = await execPromise(
      `tesseract "${tempFilePath}" stdout -l ${language}`
    );

    await unlink(tempFilePath);

    return NextResponse.json({ text: stdout });

  } catch (error: any) {
    console.error("OCR Error:", error);
    try { await unlink(tempFilePath); } catch {}
    
    return NextResponse.json(
      { error: "Failed to process image", details: error.message },
      { status: 500 }
    );
  }
}