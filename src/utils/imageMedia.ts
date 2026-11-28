export const MAX_IMAGE_REF_LENGTH = 450000;

export const DEFAULT_BRAND_LOGO_URL =
  '/assets/aistudio/e234c0e0498930d16df42529266fedc9_tplv-tiktokx-cropcenter_1080_1080_75ba3403.jpeg';

export const DEFAULT_HERO_IMAGE_URL = '/src/assets/images/hero_dilux_tech_1795578910701.jpg';

const SAFE_RASTER_DATA_URI_RE =
  /^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
const SAFE_HTTP_URL_RE = /^https?:\/\/[^\s<>"{}|\\^`[\]]+$/i;
const SAFE_LOCAL_PATH_RE = /^\/[^\s<>"{}|\\^`[\]]*$/;

export interface PresetImageAsset {
  value: string;
  labelId: string;
  labelEn: string;
}

export const PRESET_IMAGE_ASSETS: PresetImageAsset[] = [
  {
    value: DEFAULT_BRAND_LOGO_URL,
    labelId: 'Logo Resmi DILUX GROUP',
    labelEn: 'DILUX GROUP Official Logo',
  },
  {
    value: DEFAULT_HERO_IMAGE_URL,
    labelId: 'Arsitektur Teknologi Hero DILUX',
    labelEn: 'DILUX Technology Hero Architecture',
  },
  {
    value: '/src/assets/images/project_web_platform_1795578912321.jpg',
    labelId: 'Arsitektur Platform Web',
    labelEn: 'Web Platform Architecture',
  },
  {
    value: '/src/assets/images/project_network_infra_1795578911622.jpg',
    labelId: 'Topologi Infrastruktur Jaringan',
    labelEn: 'Network Infrastructure Topology',
  },
  {
    value: '/src/assets/images/project_brand_system_1795578912566.jpg',
    labelId: 'Sistem Brand & UI/UX',
    labelEn: 'Brand & UI/UX System',
  },
  {
    value: '/src/assets/images/insight_engineering_arch_1795578912165.jpg',
    labelId: 'Sampul Editorial & Rekayasa',
    labelEn: 'Engineering & Editorial Cover',
  },
];

export function isSafeImageRef(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_IMAGE_REF_LENGTH) {
    return false;
  }
  if (trimmed.startsWith('//')) {
    return false;
  }
  return (
    SAFE_HTTP_URL_RE.test(trimmed) ||
    SAFE_LOCAL_PATH_RE.test(trimmed) ||
    SAFE_RASTER_DATA_URI_RE.test(trimmed)
  );
}

export function sanitizeImageRef(value: string | undefined | null, fallback: string): string {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (isSafeImageRef(trimmed)) {
    return trimmed;
  }
  return fallback;
}

export interface CompressImageOptions {
  maxDimension?: number;
  maxChars?: number;
}

export async function compressImageFileToDataUrl(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const maxDimension = options.maxDimension ?? 1080;
  const maxChars = options.maxChars ?? 280000;

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    throw new Error('Format file harus berupa gambar raster (PNG, JPG, WebP, atau GIF).');
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Ukuran file terlalu besar (maksimal 15 MB sebelum kompresi).');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Gagal membaca file gambar yang dipilih.'));
      el.src = objectUrl;
    });

    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    if (!sourceWidth || !sourceHeight) {
      throw new Error('Dimensi gambar tidak valid.');
    }

    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;
    if (sourceWidth > maxDimension || sourceHeight > maxDimension) {
      const ratio = Math.min(maxDimension / sourceWidth, maxDimension / sourceHeight);
      targetWidth = Math.max(1, Math.round(sourceWidth * ratio));
      targetHeight = Math.max(1, Math.round(sourceHeight * ratio));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser tidak mendukung pemrosesan gambar Canvas.');
    }

    const mimeCandidates: Array<'image/webp' | 'image/jpeg'> =
      file.type === 'image/png' || file.type === 'image/webp'
        ? ['image/webp', 'image/jpeg']
        : ['image/jpeg', 'image/webp'];

    let scale = 1;
    for (let step = 0; step < 5; step += 1) {
      canvas.width = Math.max(1, Math.round(targetWidth * scale));
      canvas.height = Math.max(1, Math.round(targetHeight * scale));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      for (const mime of mimeCandidates) {
        for (const quality of [0.84, 0.72, 0.6, 0.48]) {
          const dataUrl = canvas.toDataURL(mime, quality);
          if (dataUrl.length <= maxChars && isSafeImageRef(dataUrl)) {
            return dataUrl;
          }
        }
      }
      scale *= 0.75;
    }

    throw new Error('Gambar masih melebihi batas ukuran database setelah kompresi.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
