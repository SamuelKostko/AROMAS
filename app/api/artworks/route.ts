import { NextResponse } from 'next/server';
import { generateNextArtworkId, readCatalog, writeCatalog } from '@/lib/catalog-storage';
import { isAdminSession } from '@/lib/admin-auth';
import { categories, type Artwork } from '@/lib/art-data';

export async function GET() {
  try {
    const artworks = await readCatalog();
    return NextResponse.json(artworks);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read catalog', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let artworks: Artwork[];
  try {
    artworks = await readCatalog();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read catalog', details: message }, { status: 500 });
  }

  let body: Partial<Artwork>;
  try {
    body = (await request.json()) as Partial<Artwork>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = String(body.title ?? '').trim();
  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const newArtwork: Artwork = {
    id: generateNextArtworkId(artworks),
    title,
    price: Number.isFinite(Number(body.price)) ? Number(body.price) : 0,
    description: String(body.description ?? '').trim() || 'Sin descripción.',
    image:
      String(body.image ?? '').trim() ||
      'https://images.unsplash.com/photo-1603006918143-0442e0f0fbc3?w=800&q=80',
    category:
      String(body.category ?? '').trim() ||
      (categories.find((category) => category !== 'Todos') ?? 'Velas aromáticas'),
  };

  const updated = [newArtwork, ...artworks];
  try {
    await writeCatalog(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to write catalog', details: message }, { status: 500 });
  }

  return NextResponse.json(newArtwork, { status: 201 });
}
