/**
 * Client-side image compression and optimization utility
 * Converts images to WebP format, resizes to max width 1080px (maintaining aspect ratio),
 * and compresses quality to ~0.82 for optimal performance and crisp afro braid details.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
  reductionPercentage: number;
}

export const compressImage = async (
  file: File,
  maxWidth = 1080,
  quality = 0.82
): Promise<OptimizedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if wider than maxWidth (1080px)
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao inicializar o canvas de compressão.'));
          return;
        }

        // Render with high quality bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format (or JPEG fallback)
        let format = 'image/webp';
        let dataUrl = canvas.toDataURL(format, quality);

        // Fallback to JPEG if browser doesn't produce webp dataUrl
        if (!dataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        // Calculate approximate byte size from base64
        const stringLength = dataUrl.length - dataUrl.indexOf(',') - 1;
        const compressedSize = Math.round((stringLength * 3) / 4);
        const originalSize = file.size;
        const reductionPercentage = Math.max(
          0,
          Math.round(((originalSize - compressedSize) / originalSize) * 100)
        );

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          width,
          height,
          format,
          reductionPercentage,
        });
      };

      img.onerror = () => {
        reject(new Error('Não foi possível ler o arquivo de imagem selecionado.'));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('Arquivo vazio ou ilegível.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao carregar o arquivo local.'));
    };

    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
