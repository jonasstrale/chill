import { describe, expect, it } from 'vitest';
import { validateBalancedEntries } from './index.js';

describe('validateBalancedEntries', () => {
  it('returns true for balanced entries', () => {
    expect(
      validateBalancedEntries([
        { accountId: 'a', amount: 100n, type: 'debit' },
        { accountId: 'b', amount: 100n, type: 'credit' }
      ])
    ).toBe(true);
  });

  it('throws for zero amounts', () => {
    expect(() =>
      validateBalancedEntries([{ accountId: 'a', amount: 0n, type: 'debit' }])
    ).toThrow('Entry amount must be greater than zero');
  });
});
