import { describe, expect, it, vi } from 'vitest';

import { rollbackTransaction } from '.';

describe('rollbackTransaction', () => {
  it('warns without throwing when rollback fails', async () => {
    const rollbackError = new Error('rollback failed');
    const tx = { rollback: vi.fn().mockRejectedValue(rollbackError) };
    const logger = { warn: vi.fn() };

    await expect(rollbackTransaction(tx, logger, 'test operation')).resolves.toBeUndefined();

    expect(tx.rollback).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      'Failed to rollback Spanner transaction after test operation:',
      rollbackError,
    );
  });

  it('does not warn when rollback succeeds', async () => {
    const tx = { rollback: vi.fn().mockResolvedValue(undefined) };
    const logger = { warn: vi.fn() };

    await rollbackTransaction(tx, logger, 'test operation');

    expect(logger.warn).not.toHaveBeenCalled();
  });
});
