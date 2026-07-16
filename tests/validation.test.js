import { describe, expect, it } from 'vitest';
import { validateContent, validateImageFile, safeDownloadName, MAX_FILE_SIZE } from '../src/validation.js';

describe('validateContent', () => {
  it('accepts arbitrary plain text', () => expect(validateContent('台北車站').valid).toBe(true));
  it('accepts a complete URL', () => expect(validateContent('https://example.com/path').kind).toBe('url'));
  it('accepts a domain without a scheme', () => expect(validateContent('example.com').valid).toBe(true));
  it('rejects malformed URL-like input', () => expect(validateContent('https://not a url').valid).toBe(false));
  it('rejects empty input', () => expect(validateContent('   ').valid).toBe(false));
});

describe('validateImageFile', () => {
  it('accepts supported images', () => expect(validateImageFile({ type: 'image/png', size: 100 }).valid).toBe(true));
  it('rejects unsupported types', () => expect(validateImageFile({ type: 'image/gif', size: 100 }).valid).toBe(false));
  it('rejects oversized images', () => expect(validateImageFile({ type: 'image/jpeg', size: MAX_FILE_SIZE + 1 }).valid).toBe(false));
});

it('uses fixed safe download names', () => {
  expect(safeDownloadName('png')).toBe('qr-code.png');
  expect(safeDownloadName('svg')).toBe('qr-code.svg');
});
