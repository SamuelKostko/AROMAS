import { promises as fs } from 'fs';
import path from 'path';
import type { Artwork } from '@/lib/art-data';
import { head, put } from '@vercel/blob';

const CATALOG_DIRNAME = 'data';
const CATALOG_FILENAME = 'catalog.json';
const CATALOG_BLOB_PATHNAME = `${CATALOG_DIRNAME}/${CATALOG_FILENAME}`;

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_ENV);
}

function getCatalogPath(): string {
  return path.join(process.cwd(), CATALOG_DIRNAME, CATALOG_FILENAME);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureCatalogFile(): Promise<void> {
  if (hasBlobToken()) {
    try {
      await head(CATALOG_BLOB_PATHNAME);
      return;
    } catch {
      await put(CATALOG_BLOB_PATHNAME, JSON.stringify([], null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
      });
      return;
    }
  }

  const catalogPath = getCatalogPath();
  const exists = await fileExists(catalogPath);
  if (exists) return;

  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, JSON.stringify([], null, 2), 'utf8');
}

export async function readCatalog(): Promise<Artwork[]> {
  await ensureCatalogFile();

  if (hasBlobToken()) {
    try {
      const info = await head(CATALOG_BLOB_PATHNAME);
      const res = await fetch(info.url, { cache: 'no-store' });
      if (!res.ok) return [];
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as Artwork[];
    } catch {
      return [];
    }
  }

  const catalogPath = getCatalogPath();

  const raw = await fs.readFile(catalogPath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Artwork[];
  } catch {
    return [];
  }
}

export async function writeCatalog(artworks: Artwork[]): Promise<void> {
  if (hasBlobToken()) {
    await put(CATALOG_BLOB_PATHNAME, JSON.stringify(artworks, null, 2), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
    });
    return;
  }

  if (isVercelRuntime()) {
    throw new Error(
      'Missing BLOB_READ_WRITE_TOKEN. Catalog writes are not supported on Vercel filesystem; configure Vercel Blob and set the env var.'
    );
  }

  const catalogPath = getCatalogPath();
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });

  const tmpPath = `${catalogPath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(artworks, null, 2), 'utf8');
  await fs.rename(tmpPath, catalogPath);
}

export function generateNextArtworkId(existing: Artwork[]): string {
  const numericIds = existing
    .map((a) => Number.parseInt(a.id, 10))
    .filter((n) => Number.isFinite(n));

  const next = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
  return String(next).padStart(3, '0');
}
