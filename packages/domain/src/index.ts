export type EntryType = 'debit' | 'credit';

export interface LedgerEntry {
  accountId: string;
  amount: bigint;
  type: EntryType;
}

export function validateBalancedEntries(entries: LedgerEntry[]): boolean {
  let debit = 0n;
  let credit = 0n;

  for (const entry of entries) {
    if (entry.amount <= 0n) {
      throw new Error('Entry amount must be greater than zero');
    }

    if (entry.type === 'debit') debit += entry.amount;
    if (entry.type === 'credit') credit += entry.amount;
  }

  return debit === credit;
}
