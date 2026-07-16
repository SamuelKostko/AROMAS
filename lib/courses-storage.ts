import { promises as fs } from 'fs';
import path from 'path';
import { head, put } from '@vercel/blob';

export interface Course {
  id: string;
  theme: string;
  date: string;
  time: string;
  price: number;
  isActive: boolean;
}

const DATA_DIRNAME = 'data';
const COURSES_FILENAME = 'courses.json';
const COURSES_BLOB_PATHNAME = `${DATA_DIRNAME}/${COURSES_FILENAME}`;

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_ENV);
}

function getCoursesPath(): string {
  return path.join(process.cwd(), DATA_DIRNAME, COURSES_FILENAME);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureCoursesFile(): Promise<void> {
  if (hasBlobToken()) {
    try {
      await head(COURSES_BLOB_PATHNAME);
      return;
    } catch {
      await put(COURSES_BLOB_PATHNAME, JSON.stringify([], null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    }
  }

  const coursesPath = getCoursesPath();
  const exists = await fileExists(coursesPath);
  if (exists) return;

  await fs.mkdir(path.dirname(coursesPath), { recursive: true });
  await fs.writeFile(coursesPath, JSON.stringify([], null, 2), 'utf8');
}

export async function readCourses(): Promise<Course[]> {
  await ensureCoursesFile();

  if (hasBlobToken()) {
    try {
      const info = await head(COURSES_BLOB_PATHNAME);
      const res = await fetch(info.url, { cache: 'no-store' });
      if (!res.ok) return [];
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as Course[];
    } catch {
      return [];
    }
  }

  const coursesPath = getCoursesPath();

  const raw = await fs.readFile(coursesPath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Course[];
  } catch {
    return [];
  }
}

export async function writeCourses(courses: Course[]): Promise<void> {
  if (hasBlobToken()) {
    await put(COURSES_BLOB_PATHNAME, JSON.stringify(courses, null, 2), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  if (isVercelRuntime()) {
    throw new Error(
      'Missing BLOB_READ_WRITE_TOKEN. Catalog writes are not supported on Vercel filesystem.'
    );
  }

  const coursesPath = getCoursesPath();
  await fs.mkdir(path.dirname(coursesPath), { recursive: true });

  const tmpPath = `${coursesPath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(courses, null, 2), 'utf8');
  await fs.rename(tmpPath, coursesPath);
}

export function generateNextCourseId(existing: Course[]): string {
  const numericIds = existing
    .map((c) => Number.parseInt(c.id, 10))
    .filter((n) => Number.isFinite(n));

  const next = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
  return String(next).padStart(3, '0');
}
