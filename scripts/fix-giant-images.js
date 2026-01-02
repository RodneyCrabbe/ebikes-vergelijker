#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all images from a folder
function getImagesFromFolder(folderName) {
  const imgDir = path.join(__dirname, '../public/img', folderName);
  const images = [];
  
  if (!fs.existsSync(imgDir)) {
    return images;
  }
  
  const files = fs.readdirSync(imgDir);
  const imageFiles = files
    .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
    .sort();
  
  for (const file of imageFiles) {
    images.push(`/img/${folderName}/${file}`);
  }
  
  return images;
}

// Image folder mappings
const imageMappings = {
  'Explore E+': 'Giant Explore E+',
  'Explore E+ 1': 'Giant Explore E+ 1',
  'Trance E+ 3': 'Giant Trance E+ 3'
};

function fixGiantProducts() {
  console.log('🔍 Fixing Giant product images...\n');
  
  const filesToProcess = [
    path.join(__dirname, '../src/data/ebikes.json'),
    path.join(__dirname, '../public/ebikes-data.json'),
    path.join(__dirname, '../src/data/categories/trekking-touring.json'),
    path.join(__dirname, '../src/data/categories/mountain-emtb.json'),
  ];
  
  let totalFixed = 0;
  
  for (const filePath of filesToProcess) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    console.log(`📄 Processing: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    
    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      const ebikes = Array.isArray(data) ? data : (data.ebikes || []);
      
      let fixed = 0;
      
      for (let i = 0; i < ebikes.length; i++) {
        const ebike = ebikes[i];
        
        if (ebike.brand === 'Giant' && imageMappings[ebike.model_name]) {
          const folderName = imageMappings[ebike.model_name];
          const availableImages = getImagesFromFolder(folderName);
          
          if (availableImages.length > 0) {
            const oldImageUrl = ebike.image_url;
            const oldImages = ebike.images || [];
            
            ebike.image_url = availableImages[0];
            ebike.images = availableImages;
            
            // Only log if something changed
            if (oldImageUrl !== ebike.image_url || JSON.stringify(oldImages) !== JSON.stringify(availableImages)) {
              console.log(`   ✅ ${ebike.model_name}: Updated with ${availableImages.length} images`);
              fixed++;
            }
          }
        }
      }
      
      if (fixed > 0) {
        const output = Array.isArray(data) ? ebikes : { ...data, ebikes };
        fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
        console.log(`   ✅ Fixed ${fixed} products\n`);
        totalFixed += fixed;
      } else {
        console.log(`   ℹ️  No changes needed\n`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('='.repeat(50));
  console.log(`📊 Total products fixed: ${totalFixed}`);
  console.log('='.repeat(50));
  
  if (totalFixed > 0) {
    console.log('\n✅ Successfully updated Giant product images!');
  } else {
    console.log('\n✅ All Giant products already have correct images.');
  }
}

fixGiantProducts();

