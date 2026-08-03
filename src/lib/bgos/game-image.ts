export const GAME_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 3 * 1024 * 1024;
const MAX_STORED_BYTES = 300 * 1024;

interface ResizeOptions {
  maxDimension: number;
  quality: number;
}

function getDataUrlSize(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.ceil((base64.length * 3) / 4) - padding);
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không thể đọc file ảnh đã chọn."));
    };
    image.src = objectUrl;
  });
}

function resizeToWebP(image: HTMLImageElement, options: ResizeOptions) {
  const scale = Math.min(
    1,
    options.maxDimension / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Trình duyệt không thể xử lý ảnh này.");
  }

  context.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/webp", options.quality);
  canvas.width = 0;
  canvas.height = 0;

  if (!dataUrl.startsWith("data:image/webp")) {
    throw new Error("Trình duyệt không hỗ trợ nén ảnh WebP.");
  }

  return dataUrl;
}

export async function processGameImage(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Ảnh gốc không được lớn hơn 3 MB.");
  }

  const image = await loadImage(file);
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("File ảnh không có kích thước hợp lệ.");
  }

  const firstPass = resizeToWebP(image, { maxDimension: 800, quality: 0.82 });
  if (getDataUrlSize(firstPass) <= MAX_STORED_BYTES) {
    return firstPass;
  }

  const secondPass = resizeToWebP(image, { maxDimension: 600, quality: 0.6 });
  if (getDataUrlSize(secondPass) <= MAX_STORED_BYTES) {
    return secondPass;
  }

  throw new Error("Không thể nén ảnh xuống dưới 300 KB. Vui lòng chọn ảnh khác.");
}
