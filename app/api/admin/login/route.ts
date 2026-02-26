import { NextResponse } from 'next/server';
import { getAdminPassword, setAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const password = String(body.password ?? '');
  if (!password) {
    return NextResponse.json({ error: 'password is required' }, { status: 400 });
  }

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response);
  return response;
}
