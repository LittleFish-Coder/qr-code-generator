import './styles.css';
import { validateContent, validateImageFile, safeDownloadName } from './validation.js';
import { prepareLogo } from './image.js';
import { buildQrOptions, createQrCode } from './qr.js';

const $ = (selector) => document.querySelector(selector);
const elements = {
  form: $('#controls'), data: $('#qr-data'), count: $('#char-count'), dataError: $('#data-error'),
  file: $('#logo-file'), fileError: $('#file-error'), logoSummary: $('#logo-summary'), logoThumb: $('#logo-thumb'), logoName: $('#logo-name'), removeLogo: $('#remove-logo'),
  size: $('#qr-size'), sizeOutput: $('#size-output'),
  stage: $('#qr-stage'), previewSize: $('#preview-size'), status: $('#status'), png: $('#download-png'), svg: $('#download-svg'),
};

let logo = null;
let qrCode = null;
let updateTimer = null;

function state() {
  return {
    data: elements.data.value.trim(), size: Number(elements.size.value), logo: logo?.dataUrl || null,
  };
}

function setStatus(message) {
  elements.status.textContent = message;
}

function render() {
  const result = validateContent(elements.data.value);
  elements.count.textContent = `${elements.data.value.length} / 2000`;
  elements.dataError.hidden = result.valid;
  elements.dataError.textContent = result.message || '';
  elements.data.setAttribute('aria-invalid', String(!result.valid));
  elements.png.disabled = !result.valid;
  elements.svg.disabled = !result.valid;
  if (!result.valid) return;

  const current = state();
  elements.sizeOutput.value = `${current.size} px`;
  elements.previewSize.textContent = `${current.size} × ${current.size}`;
  elements.stage.replaceChildren();
  qrCode = createQrCode(elements.stage, buildQrOptions(current));
  setStatus(`QR Code 已更新${logo ? '，已加入中央圖片' : ''}`);
}

function scheduleRender() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(render, 120);
}

elements.form.addEventListener('input', scheduleRender);

elements.file.addEventListener('change', async () => {
  const file = elements.file.files[0];
  const validation = validateImageFile(file);
  elements.fileError.hidden = validation.valid;
  elements.fileError.textContent = validation.message || '';
  if (!validation.valid) { elements.file.value = ''; return; }
  setStatus('正在安全處理標誌圖片…');
  try {
    logo = await prepareLogo(file);
    elements.logoThumb.src = logo.dataUrl;
    elements.logoName.textContent = file.name;
    elements.logoSummary.hidden = false;
    render();
  } catch (error) {
    elements.fileError.textContent = error instanceof Error ? error.message : '無法處理這張圖片。';
    elements.fileError.hidden = false;
    elements.file.value = '';
    logo = null;
    render();
  }
});

function clearLogo() {
  logo = null;
  elements.file.value = '';
  elements.logoThumb.removeAttribute('src');
  elements.logoSummary.hidden = true;
  elements.fileError.hidden = true;
  render();
}

elements.removeLogo.addEventListener('click', clearLogo);
elements.form.addEventListener('reset', () => {
  setTimeout(() => {
    logo = null;
    elements.logoSummary.hidden = true;
    elements.logoThumb.removeAttribute('src');
    elements.fileError.hidden = true;
    render();
  });
});

async function download(extension) {
  if (!qrCode || !validateContent(elements.data.value).valid) return;
  setStatus(`正在準備 ${extension.toUpperCase()} 檔案…`);
  await qrCode.download({ name: safeDownloadName(extension).replace(`.${extension}`, ''), extension });
  setStatus(`${extension.toUpperCase()} 已開始下載`);
}

elements.png.addEventListener('click', () => download('png'));
elements.svg.addEventListener('click', () => download('svg'));

render();
