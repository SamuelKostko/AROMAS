import { NextResponse } from 'next/server';
import { generateNextCourseId, readCourses, writeCourses, type Course } from '@/lib/courses-storage';
import { isAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const courses = await readCourses();
    return NextResponse.json(courses);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read courses', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let courses: Course[];
  try {
    courses = await readCourses();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read courses', details: message }, { status: 500 });
  }

  let body: Partial<Course>;
  try {
    body = (await request.json()) as Partial<Course>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const theme = String(body.theme ?? '').trim();
  if (!theme) {
    return NextResponse.json({ error: 'theme is required' }, { status: 400 });
  }

  const newCourse: Course = {
    id: generateNextCourseId(courses),
    theme,
    date: String(body.date ?? '').trim() || 'Por definir',
    time: String(body.time ?? '').trim() || 'Por definir',
    price: Number.isFinite(Number(body.price)) ? Number(body.price) : 0,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
  };

  const updated = [newCourse, ...courses];
  try {
    await writeCourses(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to write courses', details: message }, { status: 500 });
  }

  return NextResponse.json(newCourse, { status: 201 });
}
