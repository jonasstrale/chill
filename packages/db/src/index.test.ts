import { describe, expect, it } from 'vitest';

import { prisma } from './index.js';

describe('db client', () => {
  it('exports a Prisma client instance', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$disconnect).toBe('function');
  });
});
