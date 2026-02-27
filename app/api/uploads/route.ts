import { NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { isAdminSession } from '@/lib/admin-auth';
import { put } from '@vercel/blob';

function safeExtension(filename: string, mimeType: string): string {
  const fromName = path.extname(filename || '').toLowerCase();
  if (fromName && /^[.][a-z0-9]+$/.test(fromName)) return fromName;

  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
  };
  return map[mimeType] ?? '.jpg';
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized (admin session required)' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = safeExtension(file.name, file.type);
  const name = `${crypto.randomBytes(16).toString('hex')}${ext}`;

  // On Vercel, the filesystem is read-only/ephemeral. Prefer Vercel Blob when configured.
  const isVercel = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_ENV);
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (isVercel && !hasBlobToken) {
    return NextResponse.json(
      {
        error:
          'Missing BLOB_READ_WRITE_TOKEN. Configure Vercel Blob and set the env var in Vercel, then redeploy.',
      },
      { status: 500 }
    );
  }

  if (hasBlobToken) {
    try {
      const pathname = `uploads/${name}`;
      const blob = await put(pathname, buffer, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        addRandomSuffix: false,
      });

      return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json(
        { error: 'Failed to upload to Vercel Blob', details: message },
        { status: 500 }
      );
    }
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const targetPath = path.join(uploadDir, name);
    await fs.writeFile(targetPath, buffer);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException | undefined)?.code;

    // Common when deployed on read-only/ephemeral filesystems.
    if (code === 'EROFS' || code === 'EPERM' || code === 'EACCES') {
      return NextResponse.json(
        {
          error:
            'Uploads are not supported on this deployment filesystem. Use external storage (e.g., Vercel Blob/S3) or run locally.',
          code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to write uploaded file', code },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
