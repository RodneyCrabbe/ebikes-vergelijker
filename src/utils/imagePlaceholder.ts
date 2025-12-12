/**
 * Image Placeholder Utility
 * Generates placeholder images for e-bikes when no image is available
 */

export function generateEBikePlaceholder(brand: string, model: string, width = 300, height = 200): string {
  // Create a simple SVG placeholder with brand and model
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)"/>
    <g transform="translate(${width/2}, ${height/2})">
      <g transform="translate(0, -20)">
        <circle cx="-15" cy="0" r="8" fill="#9ca3af" stroke="#6b7280" stroke-width="2"/>
        <circle cx="15" cy="0" r="8" fill="#9ca3af" stroke="#6b7280" stroke-width="2"/>
        <path d="M -15 0 Q 0 -15 15 0" stroke="#6b7280" stroke-width="3" fill="none"/>
        <rect x="-20" y="-5" width="40" height="10" rx="5" fill="#6b7280"/>
      </g>
      <text x="0" y="10" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151">${brand}</text>
      <text x="0" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">${model}</text>
    </g>
  </svg>`;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Convert local image paths to WordPress URLs in production
 */
function convertToWordPressUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  
  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a data URI, return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // In production, convert local /img/ paths to WordPress URLs
  const wpApiUrl = import.meta.env.VITE_WP_API_URL || '';
  if (wpApiUrl && (import.meta.env.PROD || import.meta.env.MODE === 'production')) {
    // Extract WordPress base URL (remove /wp-json)
    const wpBaseUrl = wpApiUrl.replace('/wp-json', '');
    
    // Convert /img/... paths to WordPress media URLs
    if (imageUrl.startsWith('/img/')) {
      // WordPress media URLs typically use /wp-content/uploads/
      // For now, we'll use the WordPress site URL + the image path
      return `${wpBaseUrl}${imageUrl}`;
    }
    
    // For other relative paths, prepend WordPress base URL
    if (imageUrl.startsWith('/')) {
      return `${wpBaseUrl}${imageUrl}`;
    }
  }
  
  // In development, return local paths as is
  return imageUrl;
}

export function getEBikeImageUrl(ebike: any): string {
  let imageUrl: string = '';
  
  // If the e-bike has an images array with at least one image, use the first one
  if (ebike.images && Array.isArray(ebike.images) && ebike.images.length > 0) {
    imageUrl = ebike.images[0];
  }
  // If the e-bike has an image URL, use it
  else if (ebike.image_url && ebike.image_url.trim() !== '') {
    imageUrl = ebike.image_url;
  }
  
  // Convert to WordPress URL if needed
  if (imageUrl) {
    return convertToWordPressUrl(imageUrl);
  }
  
  // Otherwise, generate a placeholder
  return generateEBikePlaceholder(ebike.brand || 'E-Bike', ebike.model_name || 'Model');
}
