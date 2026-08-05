// src/lib/resizeImage.ts
//
// Downscales an image data URL client-side before it's sent to the AI
// room-detection endpoint. Uploads can be up to ~5MB, which becomes ~6.7MB
// once base64-encoded — slow to upload, slow for the vision model to
// process, and closer to platform request-size limits. Floor plan text
// stays legible well below full camera/scan resolution, so this trims the
// payload without hurting detection accuracy. The original, full-quality
// image is left untouched for display and for the paid PDF report.

export async function resizeDataUrlForDetection(
  dataUrl: string,
  maxDimension = 1800,
  quality = 0.9
): Promise<string> {
  try {
    const img = await loadImage(dataUrl);
    const { width, height } = img;

    if (!width || !height) return dataUrl;

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    if (scale >= 1) return dataUrl; // already small enough, skip re-encoding

    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;

    // Flatten onto white first so transparent PNGs don't turn black once
    // exported as JPEG.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    return canvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.error("resizeDataUrlForDetection failed, using original image", err);
    return dataUrl;
  }
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for resizing"));
    img.src = dataUrl;
  });
}
