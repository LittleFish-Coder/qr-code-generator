import QRCodeStyling from 'qr-code-styling';

export function createQrCode(container, options) {
  const qr = new QRCodeStyling(options);
  qr.append(container);
  return qr;
}

export function buildQrOptions(state) {
  const hasLogo = Boolean(state.logo);
  return {
    width: state.size,
    height: state.size,
    type: 'svg',
    data: state.data,
    margin: 16,
    qrOptions: { errorCorrectionLevel: hasLogo ? 'H' : 'M' },
    image: state.logo || undefined,
    dotsOptions: { color: '#111111', type: 'square' },
    backgroundOptions: { color: '#ffffff' },
    cornersSquareOptions: { color: '#111111', type: 'square' },
    cornersDotOptions: { color: '#111111', type: 'square' },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.28,
      margin: Math.max(4, Math.round(state.size * 0.018)),
      crossOrigin: 'anonymous',
    },
  };
}
