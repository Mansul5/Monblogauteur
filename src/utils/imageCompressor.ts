/**
 * Utility to compress and resize cover images on the client side
 * to keep them well within Cloud Firestore's 1 MiB document limit.
 * An uncompressed 3MB image is reduced to ~40KB - 90KB with excellent visual fidelity.
 */

export async function compressImageSource(
  source: File | string,
  maxWidth = 700,
  maxHeight = 1050,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate proportional downscaling
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback: resolve original if canvas 2d context fails
        if (typeof source === 'string') resolve(source);
        else {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(source);
        }
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as optimized JPEG
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // If still above 500KB (~680K chars in base64), do a second more aggressive pass
      if (compressedDataUrl.length > 500000) {
        compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
      }

      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      console.warn('Image compression failed to load image, using fallback:', err);
      if (typeof source === 'string') {
        resolve(source);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(source);
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
