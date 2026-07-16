export const MAX_TEXT_LENGTH = 2000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

const URL_LIKE = /^(?:https?:\/\/|www\.|[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)+)/i;

export function validateContent(value) {
  const text = value.trim();
  if (!text) return { valid: false, message: '請輸入網址或文字。' };
  if (text.length > MAX_TEXT_LENGTH) return { valid: false, message: `內容不可超過 ${MAX_TEXT_LENGTH} 個字元。` };
  if (!URL_LIKE.test(text)) return { valid: true, value: text, kind: 'text' };

  const candidate = /^(https?:\/\/)/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error('invalid');
    return { valid: true, value: text, kind: 'url' };
  } catch {
    return { valid: false, message: '這看起來像網址，但格式不完整。請檢查後再試。' };
  }
}

export function validateImageFile(file) {
  if (!file) return { valid: false, message: '找不到所選的檔案。' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { valid: false, message: '僅支援 PNG、JPEG、WebP 與 SVG 圖片。' };
  if (file.size > MAX_FILE_SIZE) return { valid: false, message: '圖片超過 5 MB，請選擇較小的檔案。' };
  if (file.size === 0) return { valid: false, message: '圖片檔案是空的。' };
  return { valid: true };
}

export function safeDownloadName(extension) {
  return extension === 'svg' ? 'qr-code.svg' : 'qr-code.png';
}
