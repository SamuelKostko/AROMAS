import { NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { isAdminSession } from '@/lib/admin-auth';

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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const maxBytes = 5 * 1024 * 1024; // 5MB
  if (buffer.byteLength > maxBytes) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 });
  }

  const ext = safeExtension(file.name, file.type);
  const name = `${crypto.randomBytes(16).toString('hex')}${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const targetPath = path.join(uploadDir, name);
  await fs.writeFile(targetPath, buffer);

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
