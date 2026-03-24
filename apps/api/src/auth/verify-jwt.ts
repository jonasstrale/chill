import { createRemoteJWKSet, jwtVerify } from 'jose';

export async function verifyAccessToken(token: string) {
  const issuer = process.env.KEYCLOAK_ISSUER;
  const audience = process.env.KEYCLOAK_AUDIENCE;

  if (!issuer || !audience) {
    throw new Error('Missing KEYCLOAK_ISSUER or KEYCLOAK_AUDIENCE');
  }

  const jwks = createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`));
  return jwtVerify(token, jwks, { issuer, audience });
}
