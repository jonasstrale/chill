import { NextResponse } from 'next/server';

function legacyResponse() {
  return NextResponse.json(
    { error: 'The legacy next-auth endpoint has been replaced by the OIDC login route at /api/auth/login.' },
    { status: 410 }
  );
}

export async function GET() {
  return legacyResponse();
}

export async function POST() {
  return legacyResponse();
}
