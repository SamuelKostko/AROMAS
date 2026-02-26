import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'hyoss_admin_session';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'admin';
}

export function hashAdminPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function getExpectedAdminSessionValue(): string {
  return hashAdminPassword(getAdminPassword());
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(value) && value === getExpectedAdminSessionValue();
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getExpectedAdminSessionValue(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}
