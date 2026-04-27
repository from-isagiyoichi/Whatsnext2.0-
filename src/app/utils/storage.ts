/**
 * Utility functions for localStorage management
 */

/**
 * Get the size of localStorage in MB
 */
export function getLocalStorageSize(): number {
  let totalSize = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  return totalSize / (1024 * 1024); // Convert to MB
}

/**
 * Get the size of a specific localStorage key in KB
 */
export function getItemSize(key: string): number {
  const item = localStorage.getItem(key);
  if (!item) return 0;
  return (item.length + key.length) / 1024; // Convert to KB
}

/**
 * Log localStorage usage statistics
 */
export function logStorageStats(): void {
  const totalSize = getLocalStorageSize();
  console.log(`📊 Total localStorage size: ${totalSize.toFixed(2)} MB`);

  const keys = ['eventsData', 'studentsData', 'chatData', 'adminEmail', 'adminPassword'];
  keys.forEach(key => {
    const size = getItemSize(key);
    if (size > 0) {
      console.log(`  - ${key}: ${size.toFixed(2)} KB`);
    }
  });

  if (totalSize > 4) {
    console.warn('⚠️ localStorage is getting full! Consider reducing data size.');
  }
}

/**
 * Check if an item can fit in localStorage
 */
export function canFitInStorage(itemSize: number): boolean {
  const currentSize = getLocalStorageSize();
  const newSize = currentSize + (itemSize / (1024 * 1024));
  return newSize < 5; // Conservative 5MB limit
}

/**
 * Compress base64 image by reducing quality
 */
export function compressBase64Image(
  base64: string,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if needed
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64);
      }
    };
    img.src = base64;
  });
}
