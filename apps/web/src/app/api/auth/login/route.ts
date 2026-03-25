import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_STATE_COOKIE_NAME,
  AUTH_VERIFIER_COOKIE_NAME,
  buildAuthorizationRequest,
  getAuthCookieOptions
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { authorizationUrl, codeVerifier, state } = await buildAuthorizationRequest(request.nextUrl.origin);
  const response = NextResponse.redirect(authorizationUrl);
  const cookieOptions = getAuthCookieOptions(request.nextUrl.origin, AUTH_COOKIE_MAX_AGE_SECONDS);

  response.cookies.set(AUTH_STATE_COOKIE_NAME, state, cookieOptions);
  response.cookies.set(AUTH_VERIFIER_COOKIE_NAME, codeVerifier, cookieOptions);

  return response;
}
