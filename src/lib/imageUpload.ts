export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Не удалось прочитать изображение"));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function compressDataUrl(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось обработать изображение");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function processProductImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Выберите файл изображения (JPG, PNG или WebP)");
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 10 МБ)");
  }

  const dataUrl = await readFileAsDataUrl(file);
  return compressDataUrl(dataUrl);
}

export function isProductImageSrc(value?: string): boolean {
  return Boolean(value?.startsWith("http") || value?.startsWith("data:"));
}
