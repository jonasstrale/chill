import { describe, expect, it } from 'vitest';
import { buildServer } from '../server.js';

describe('health', () => {
  it('returns ok', async () => {
    const app = buildServer();
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });
    await app.close();
  });
});
