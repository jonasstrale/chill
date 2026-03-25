import { describe, expect, it, vi } from 'vitest';

import { createCodeChallenge, createSessionCookieValue, readSessionCookieValue } from './auth';

describe('auth helpers', () => {
  it('creates the RFC 7636 S256 challenge', () => {
    expect(createCodeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
    );
  });

  it('round-trips a signed session cookie', () => {
    vi.stubEnv('APP_SESSION_SECRET', 'test-session-secret');

    const cookie = createSessionCookieValue({
      email: 'user@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      name: 'Example User',
      sub: 'user-123'
    });

    expect(readSessionCookieValue(cookie)).toEqual({
      email: 'user@example.com',
      exp: expect.any(Number),
      name: 'Example User',
      sub: 'user-123'
    });
  });

  it('rejects a tampered session cookie', () => {
    vi.stubEnv('APP_SESSION_SECRET', 'test-session-secret');

    const cookie = createSessionCookieValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
      sub: 'user-123'
    });
    const tampered = `${cookie.slice(0, -1)}x`;

    expect(readSessionCookieValue(tampered)).toBeNull();
  });
});
