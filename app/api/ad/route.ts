import { NextResponse } from 'next/server';
import { readAd, writeAd, type AdData } from '@/lib/ad-storage';
import { isAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const ad = await readAd();
    return NextResponse.json(ad);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read ad', details: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Partial<AdData>;
  try {
    body = (await request.json()) as Partial<AdData>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const newAd: AdData = {
    imageUrl: String(body.imageUrl ?? '').trim(),
    linkUrl: String(body.linkUrl ?? '').trim(),
    isActive: Boolean(body.isActive),
  };

  try {
    await writeAd(newAd);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to write ad', details: message }, { status: 500 });
  }

  return NextResponse.json(newAd, { status: 200 });
}
