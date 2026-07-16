import { promises as fs } from 'fs';
import path from 'path';
import { head, put } from '@vercel/blob';

export interface AdData {
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

const DATA_DIRNAME = 'data';
const AD_FILENAME = 'ad.json';
const AD_BLOB_PATHNAME = `${DATA_DIRNAME}/${AD_FILENAME}`;

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_ENV);
}

function getAdPath(): string {
  return path.join(process.cwd(), DATA_DIRNAME, AD_FILENAME);
}

const defaultAd: AdData = {
  imageUrl: '',
  linkUrl: '',
  isActive: false,
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureAdFile(): Promise<void> {
  if (hasBlobToken()) {
    try {
      await head(AD_BLOB_PATHNAME);
      return;
    } catch {
      await put(AD_BLOB_PATHNAME, JSON.stringify(defaultAd, null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    }
  }

  const adPath = getAdPath();
  const exists = await fileExists(adPath);
  if (exists) return;

  await fs.mkdir(path.dirname(adPath), { recursive: true });
  await fs.writeFile(adPath, JSON.stringify(defaultAd, null, 2), 'utf8');
}

export async function readAd(): Promise<AdData> {
  await ensureAdFile();

  if (hasBlobToken()) {
    try {
      const info = await head(AD_BLOB_PATHNAME);
      const res = await fetch(info.url, { cache: 'no-store' });
      if (!res.ok) return defaultAd;
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      return parsed as AdData;
    } catch {
      return defaultAd;
    }
  }

  const adPath = getAdPath();

  const raw = await fs.readFile(adPath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return parsed as AdData;
  } catch {
    return defaultAd;
  }
}

export async function writeAd(ad: AdData): Promise<void> {
  if (hasBlobToken()) {
    await put(AD_BLOB_PATHNAME, JSON.stringify(ad, null, 2), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  if (isVercelRuntime()) {
    throw new Error(
      'Missing BLOB_READ_WRITE_TOKEN. Ad writes are not supported on Vercel filesystem.'
    );
  }

  const adPath = getAdPath();
  await fs.mkdir(path.dirname(adPath), { recursive: true });

  const tmpPath = `${adPath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(ad, null, 2), 'utf8');
  await fs.rename(tmpPath, adPath);
}
