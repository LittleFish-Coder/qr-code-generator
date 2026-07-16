const MAX_DIMENSION = 1600;

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('無法讀取圖片檔案。'));
    reader.readAsText(file);
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('圖片內容無法辨識或已損毀。'));
    image.src = url;
  });
}

function sanitizeSvg(source) {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (document.querySelector('parsererror')) throw new Error('SVG 格式無效。');
  document.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((node) => node.remove());
  document.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || ((name === 'href' || name === 'xlink:href') && !value.startsWith('#') && !value.startsWith('data:image/'))) {
        node.removeAttribute(attribute.name);
      }
      if (name === 'style' && /url\s*\(|expression\s*\(/i.test(value)) node.removeAttribute(attribute.name);
    });
  });
  return new XMLSerializer().serializeToString(document.documentElement);
}

export async function prepareLogo(file) {
  let sourceBlob = file;
  if (file.type === 'image/svg+xml') {
    const cleanSvg = sanitizeSvg(await readAsText(file));
    sourceBlob = new Blob([cleanSvg], { type: 'image/svg+xml' });
  }

  const objectUrl = URL.createObjectURL(sourceBlob);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    return { dataUrl: canvas.toDataURL('image/png'), width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
