import { promises as fs } from 'fs';
import path from 'path';
import type { Artwork } from '@/lib/art-data';

const CATALOG_DIRNAME = 'data';
const CATALOG_FILENAME = 'catalog.json';

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
  const catalogPath = getCatalogPath();
  const exists = await fileExists(catalogPath);
  if (exists) return;

  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, JSON.stringify([], null, 2), 'utf8');
}

export async function readCatalog(): Promise<Artwork[]> {
  const catalogPath = getCatalogPath();
  await ensureCatalogFile();

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
