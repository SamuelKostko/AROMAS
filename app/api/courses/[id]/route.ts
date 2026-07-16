import { NextResponse } from 'next/server';
import { readCourses, writeCourses, type Course } from '@/lib/courses-storage';
import { isAdminSession } from '@/lib/admin-auth';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let courses: Course[];
  try {
    courses = await readCourses();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read courses', details: message }, { status: 500 });
  }

  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  let body: Partial<Course>;
  try {
    body = (await request.json()) as Partial<Course>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updatedCourse: Course = {
    ...courses[index],
  };

  if (body.theme !== undefined) updatedCourse.theme = String(body.theme).trim();
  if (body.date !== undefined) updatedCourse.date = String(body.date).trim();
  if (body.time !== undefined) updatedCourse.time = String(body.time).trim();
  if (body.price !== undefined) updatedCourse.price = Number(body.price);
  if (body.isActive !== undefined) updatedCourse.isActive = Boolean(body.isActive);

  if (!updatedCourse.theme) {
    return NextResponse.json({ error: 'theme cannot be empty' }, { status: 400 });
  }

  courses[index] = updatedCourse;

  try {
    await writeCourses(courses);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save courses', details: message }, { status: 500 });
  }

  return NextResponse.json(updatedCourse);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let courses: Course[];
  try {
    courses = await readCourses();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to read courses', details: message }, { status: 500 });
  }

  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  try {
    await writeCourses(filtered);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save courses', details: message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
