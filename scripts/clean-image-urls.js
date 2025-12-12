#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanImageUrl(url) {
  if (!url) return url;
  // Remove query parameters (e.g., ?v=1760346847501)
  return url.split('?')[0];
}

async function cleanAllImageUrls() {
  console.log('🧹 Cleaning image URLs (removing query parameters)...');
  
  const dataPath = path.join(__dirname, '../src/data/ebikes.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const ebikes = JSON.parse(rawData);
  
  let cleaned = 0;
  
  for (let i = 0; i < ebikes.length; i++) {
    const ebike = ebikes[i];
    let updated = false;
    
    // Clean image_url
    if (ebike.image_url && ebike.image_url.includes('?')) {
      ebike.image_url = cleanImageUrl(ebike.image_url);
      updated = true;
    }
    
    // Clean images array
    if (ebike.images && Array.isArray(ebike.images)) {
      const cleanedImages = ebike.images.map(img => cleanImageUrl(img));
      if (JSON.stringify(cleanedImages) !== JSON.stringify(ebike.images)) {
        ebike.images = cleanedImages;
        updated = true;
      }
    }
    
    if (updated) {
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(ebikes, null, 2), 'utf-8');
    console.log(`✅ Cleaned ${cleaned} e-bikes`);
  } else {
    console.log(`✅ All image URLs are already clean!`);
  }
}

cleanAllImageUrls().catch(console.error);

