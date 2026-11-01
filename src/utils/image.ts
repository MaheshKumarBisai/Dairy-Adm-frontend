export const S3_BASE_URL = 'https://prod-dairy-images-09876.s3.us-east-2.amazonaws.com';

// Clean, high-resolution dairy stock photos for seed/missing items
export const FALLBACK_DAIRY_IMAGES: Record<string, string> = {
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  curd: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80',
  ghee: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
  butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
};

export function getFallbackForName(name: string = ''): string {
  const lower = name.toLowerCase();
  if (lower.includes('milk')) return FALLBACK_DAIRY_IMAGES.milk;
  if (lower.includes('curd') || lower.includes('yogurt') || lower.includes('dahi')) return FALLBACK_DAIRY_IMAGES.curd;
  if (lower.includes('ghee')) return FALLBACK_DAIRY_IMAGES.ghee;
  if (lower.includes('butter')) return FALLBACK_DAIRY_IMAGES.butter;
  if (lower.includes('paneer') || lower.includes('cheese')) return FALLBACK_DAIRY_IMAGES.paneer;
  return FALLBACK_DAIRY_IMAGES.default;
}

/**
 * Resolves product image URLs cleanly:
 * - Replaces broken fake cdn.example.com URLs with relevant dairy photography
 * - Prepends S3 bucket origin for relative /uploads/... paths
 * - Prepends S3 bucket origin for raw image filenames
 * - Retains full S3 or HTTP(S) URLs
 */
export function resolveProductImage(url: string | null | undefined, productName: string = ''): string {
  if (!url) {
    return getFallbackForName(productName);
  }

  // Handle fake placeholder cdn.example.com
  if (url.includes('cdn.example.com')) {
    return getFallbackForName(productName);
  }

  // Full Amazon S3 or HTTPS URLs
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }

  // Relative path starting with /uploads/
  if (url.startsWith('/uploads/')) {
    return `${S3_BASE_URL}${url}`;
  }

  // Filename starting with IMG or PRD
  if (url.startsWith('IMG-') || url.startsWith('PRD_') || url.startsWith('PRD-')) {
    return `${S3_BASE_URL}/uploads/MR-100001/${url}`;
  }

  return url;
}
