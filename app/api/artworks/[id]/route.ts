import { NextResponse } from 'next/server';
import { readCatalog, writeCatalog } from '@/lib/catalog-storage';
import { isAdminSession } from '@/lib/admin-auth';
import type { Artwork } from '@/lib/art-data';

type RouteParams = { params: Promise<{ id: string }> };

function mergeArtwork(existing: Artwork, patch: Partial<Artwork>): Artwork {
  return {
    ...existing,
    ...patch,
    id: existing.id,
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  let artworks: Artwork[];
  try {
    artworks = await readCatalog();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read catalog', details: message }, { status: 500 });
  }
  const artwork = artworks.find((a) => a.id === id);
  if (!artwork) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(artwork);
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let artworks: Artwork[];
  try {
    artworks = await readCatalog();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read catalog', details: message }, { status: 500 });
  }
  const index = artworks.findIndex((a) => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let patch: Partial<Artwork>;
  try {
    patch = (await request.json()) as Partial<Artwork>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updatedArtwork = mergeArtwork(artworks[index], patch);
  const updated = [...artworks];
  updated[index] = updatedArtwork;

  try {
    await writeCatalog(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to write catalog', details: message }, { status: 500 });
  }
  return NextResponse.json(updatedArtwork);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let artworks: Artwork[];
  try {
    artworks = await readCatalog();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read catalog', details: message }, { status: 500 });
  }
  const updated = artworks.filter((a) => a.id !== id);
  if (updated.length === artworks.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await writeCatalog(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to write catalog', details: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
