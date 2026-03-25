import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_STATE_COOKIE_NAME,
  AUTH_VERIFIER_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  createSessionCookieValue,
  exchangeCodeForSession,
  getAuthCookieOptions
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const returnedState = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(AUTH_STATE_COOKIE_NAME)?.value;
  const codeVerifier = request.cookies.get(AUTH_VERIFIER_COOKIE_NAME)?.value;

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code.' }, { status: 400 });
  }

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return NextResponse.json({ error: 'OIDC state validation failed.' }, { status: 400 });
  }

  if (!codeVerifier) {
    return NextResponse.json({ error: 'Missing PKCE code verifier.' }, { status: 400 });
  }

  const session = await exchangeCodeForSession({
    code,
    codeVerifier,
    origin: request.nextUrl.origin
  });
  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.set(
    SESSION_COOKIE_NAME,
    createSessionCookieValue(session),
    getAuthCookieOptions(request.nextUrl.origin, Math.max(session.exp - Math.floor(Date.now() / 1000), 1))
  );
  response.cookies.set(AUTH_STATE_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  response.cookies.set(AUTH_VERIFIER_COOKIE_NAME, '', { maxAge: 0, path: '/' });

  return response;
}
