# QR 留白室（QR Code Generator）

一個隱私友善的靜態 QR Code 產生器，支援在 QR Code 中央加入標誌圖片。所有文字、網址與圖片處理都只在瀏覽器本機進行，不會上傳到任何伺服器。

## 功能

- 支援網址與任意純文字
- 支援 PNG、JPEG、WebP、SVG 中央標誌（最大 5 MB）
- 僅保留必要的尺寸調整，預設為 320 px
- 加入標誌時自動使用 H 最高容錯等級
- 固定高對比黑白 QR Code、方形點陣與安全留白
- 即時預覽，下載 PNG 或內嵌標誌的 SVG
- 響應式、鍵盤可操作的繁體中文介面
- 無後端、無分析、無追蹤、無動態重新導向

## 隱私

輸入內容與圖片只存在目前的瀏覽器記憶體。圖片會在裝置上縮放並轉成內嵌資料；不使用外部圖片上傳服務，也不會傳送至網路。

## 本機開發

需要 Node.js 22.12 以上版本（部署使用 Node.js 24 LTS）。

```bash
npm ci
npm run dev
```

## 品質檢查與建置

```bash
npm run lint
npm test -- --run
npm run build
```

## GitHub Pages

Vite 的 base path 已設為 `/qr-code-generator/`。推送至 `main` 後，`.github/workflows/deploy-pages.yml` 會先執行安裝、程式碼檢查、測試與建置，再把 `dist` 部署至 GitHub Pages。

預期網址：`https://<你的 GitHub 使用者名稱>.github.io/qr-code-generator/`

若 Pages 未自動啟用，請到：**Repository Settings → Pages → Build and deployment → Source → GitHub Actions**。

## 掃描可靠度

中央標誌會保留原始比例，僅遮住必要的中央點陣，並加上白色邊距；三個定位框與外圍留白不受影響。即使如此，不同標誌、顏色、印刷材質、尺寸與掃描裝置都可能影響結果。發布或印刷前，請以多部裝置實際掃描測試。

## License

[MIT](LICENSE)
