import QRCodeStyling from 'qr-code-styling';

export function createQrCode(container, options) {
  const qr = new QRCodeStyling(options);
  qr.append(container);
  return qr;
}

export function buildQrOptions(state) {
  const hasLogo = Boolean(state.logo);
  const qrColor = state.color === 'white' ? '#ffffff' : '#111111';
  const hasBackground = state.hasBackground !== false;
  return {
    width: state.size,
    height: state.size,
    type: 'svg',
    data: state.data,
    margin: 16,
    qrOptions: { errorCorrectionLevel: hasLogo ? 'H' : 'M' },
    image: state.logo || undefined,
    dotsOptions: { color: qrColor, type: 'square' },
    backgroundOptions: { color: hasBackground ? '#ffffff' : 'transparent' },
    cornersSquareOptions: { color: qrColor, type: 'square' },
    cornersDotOptions: { color: qrColor, type: 'square' },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.28,
      margin: Math.max(4, Math.round(state.size * 0.018)),
      crossOrigin: 'anonymous',
    },
  };
}
