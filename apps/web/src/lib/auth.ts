import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { createRemoteJWKSet, jwtVerify } from 'jose';

export const AUTH_STATE_COOKIE_NAME = 'economy_oidc_state';
export const AUTH_VERIFIER_COOKIE_NAME = 'economy_oidc_verifier';
export const SESSION_COOKIE_NAME = 'economy_session';

const AUTH_SCOPE = 'openid profile email';
const AUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60;

type OidcConfiguration = {
  authorization_endpoint: string;
  issuer: string;
  jwks_uri: string;
  token_endpoint: string;
};

export type Session = {
  email?: string;
  exp: number;
  name?: string;
  sub: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET ?? getRequiredEnv('NEXTAUTH_SECRET');
}

function getKeycloakIssuer() {
  return getRequiredEnv('KEYCLOAK_ISSUER').replace(/\/$/, '');
}

function getRedirectUri(origin: string) {
  return new URL('/api/auth/callback', origin).toString();
}

export function createRandomString(size = 32) {
  return randomBytes(size).toString('base64url');
}

export function createCodeChallenge(codeVerifier: string) {
  return createHash('sha256').update(codeVerifier).digest('base64url');
}

async function getOidcConfiguration(): Promise<OidcConfiguration> {
  const issuer = getKeycloakIssuer();
  const response = await fetch(`${issuer}/.well-known/openid-configuration`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`OIDC discovery failed with status ${response.status}`);
  }

  const json = (await response.json()) as Partial<OidcConfiguration>;

  if (!json.authorization_endpoint || !json.issuer || !json.jwks_uri || !json.token_endpoint) {
    throw new Error('OIDC discovery response is missing required endpoints');
  }

  return {
    authorization_endpoint: json.authorization_endpoint,
    issuer: json.issuer,
    jwks_uri: json.jwks_uri,
    token_endpoint: json.token_endpoint
  };
}

export async function buildAuthorizationRequest(origin: string) {
  const config = await getOidcConfiguration();
  const state = createRandomString(24);
  const codeVerifier = createRandomString(32);
  const authorizationUrl = new URL(config.authorization_endpoint);

  authorizationUrl.searchParams.set('client_id', getRequiredEnv('KEYCLOAK_CLIENT_ID'));
  authorizationUrl.searchParams.set('code_challenge', createCodeChallenge(codeVerifier));
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');
  authorizationUrl.searchParams.set('redirect_uri', getRedirectUri(origin));
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', AUTH_SCOPE);
  authorizationUrl.searchParams.set('state', state);

  return {
    authorizationUrl: authorizationUrl.toString(),
    codeVerifier,
    state
  };
}

export async function exchangeCodeForSession(input: {
  code: string;
  codeVerifier: string;
  origin: string;
}): Promise<Session> {
  const config = await getOidcConfiguration();
  const body = new URLSearchParams({
    client_id: getRequiredEnv('KEYCLOAK_CLIENT_ID'),
    client_secret: getRequiredEnv('KEYCLOAK_CLIENT_SECRET'),
    code: input.code,
    code_verifier: input.codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: getRedirectUri(input.origin)
  });
  const response = await fetch(config.token_endpoint, {
    body,
    cache: 'no-store',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(`OIDC token exchange failed with status ${response.status}`);
  }

  const json = (await response.json()) as { id_token?: string };

  if (!json.id_token) {
    throw new Error('OIDC token response did not include an id_token');
  }

  const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
  const { payload } = await jwtVerify(json.id_token, jwks, {
    audience: getRequiredEnv('KEYCLOAK_CLIENT_ID'),
    issuer: config.issuer
  });

  if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
    throw new Error('OIDC id_token is missing required claims');
  }

  return {
    email: typeof payload.email === 'string' ? payload.email : undefined,
    exp: payload.exp,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    sub: payload.sub
  };
}

export function createSessionCookieValue(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');

  return `${payload}.${signature}`;
}

export function readSessionCookieValue(value?: string | null): Session | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac('sha256', getSessionSecret()).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session;

  if (typeof session.sub !== 'string' || typeof session.exp !== 'number') {
    return null;
  }

  if (session.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return session;
}

export function getAuthCookieOptions(origin: string, maxAge: number) {
  const isSecure = new URL(origin).protocol === 'https:';

  return {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax' as const,
    secure: isSecure
  };
}

export { AUTH_COOKIE_MAX_AGE_SECONDS };
