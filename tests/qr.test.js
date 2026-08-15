import { describe, expect, it } from 'vitest';
import { buildQrOptions } from '../src/qr.js';

describe('buildQrOptions', () => {
  it('uses black QR with white background by default', () => {
    const options = buildQrOptions({ data: 'https://example.com', size: 320, logo: null });

    expect(options.dotsOptions.color).toBe('#111111');
    expect(options.cornersSquareOptions.color).toBe('#111111');
    expect(options.cornersDotOptions.color).toBe('#111111');
    expect(options.backgroundOptions.color).toBe('#ffffff');
  });

  it('supports white QR color', () => {
    const options = buildQrOptions({ data: 'https://example.com', size: 320, logo: null, color: 'white' });

    expect(options.dotsOptions.color).toBe('#ffffff');
    expect(options.cornersSquareOptions.color).toBe('#ffffff');
    expect(options.cornersDotOptions.color).toBe('#ffffff');
    expect(options.backgroundOptions.color).toBe('#ffffff');
  });

  it('supports removing the background', () => {
    const options = buildQrOptions({ data: 'https://example.com', size: 320, logo: null, hasBackground: false });

    expect(options.backgroundOptions.color).toBe('transparent');
  });
});
