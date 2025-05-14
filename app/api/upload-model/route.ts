import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { stat, mkdir } from 'fs/promises';

// Helper function to ensure directory exists
async function ensureDirExists(dirPath: string) {
  try {
    await stat(dirPath);
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'ENOENT') {
      try {
        await mkdir(dirPath, { recursive: true });
      } catch (mkdirError) {
        console.error('Error creating directory:', mkdirError);
        throw new Error('Could not create upload directory.');
      }
    } else {
      console.error('Error checking directory:', e);
      throw new Error('Could not verify upload directory.');
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('modelFile') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    const validExtensions = ['.glb', '.gltf'];
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. Only .glb or .gltf files are supported.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename (basic example, consider more robust sanitization)
    const originalFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${Date.now()}-${originalFilename}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'models');
    await ensureDirExists(uploadDir);
    
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    console.log(`File uploaded to: ${filePath}`);
    const publicPath = `/uploads/models/${filename}`;

    return NextResponse.json({ success: true, filePath: publicPath });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
} 