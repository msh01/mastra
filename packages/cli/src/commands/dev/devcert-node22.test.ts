import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type WindowsPlatformWithCrypto = {
  encrypt(text: string, key: string): string;
  decrypt(encrypted: string, key: string): string;
};

describe('@expo/devcert Node 22 compatibility patch', () => {
  it('encrypts and decrypts Windows protected files without removed crypto APIs', () => {
    const WindowsPlatform = require('@expo/devcert/dist/platforms/win32').default as new () => WindowsPlatformWithCrypto;
    const platform = new WindowsPlatform();

    const encrypted = platform.encrypt('localhost certificate', 'devcert-password');

    expect(encrypted).not.toBe('localhost certificate');
    expect(platform.decrypt(encrypted, 'devcert-password')).toBe('localhost certificate');
  });
});
