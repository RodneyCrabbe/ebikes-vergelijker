#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get all images for a specific e-bike from the public/img directory
function getAvailableImages(brand, modelName) {
  const imgDir = path.join(__dirname, '../public/img');
  const images = [];
  
  if (!fs.existsSync(imgDir)) {
    return images;
  }
  
  // Try different possible directory names
  const possibleDirs = [
    `${brand} ${modelName}`,
    `${brand} ${modelName.replace(/[^a-zA-Z0-9\s]/g, '')}`,
    `${brand}`,
    modelName,
    modelName.replace(/[^a-zA-Z0-9\s]/g, '')
  ];
  
  for (const dirName of possibleDirs) {
    const dirPath = path.join(imgDir, dirName);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
      );
      
      for (const file of imageFiles) {
        images.push(`/img/${dirName}/${file}`);
      }
      
      if (images.length > 0) {
        break; // Found images, stop looking
      }
    }
  }
  
  return images;
}

async function fixMissingImages() {
  console.log('🔍 Checking for missing images...');
  
  // Read ebikes.json
  const dataPath = path.join(__dirname, '../src/data/ebikes.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const ebikes = JSON.parse(rawData);
  
  console.log(`📊 Found ${ebikes.length} e-bikes in JSON.`);
  
  let fixed = 0;
  let missing = 0;
  
  for (let i = 0; i < ebikes.length; i++) {
    const ebike = ebikes[i];
    const hasImageUrl = ebike.image_url && ebike.image_url.trim() !== '';
    const hasImages = ebike.images && Array.isArray(ebike.images) && ebike.images.length > 0;
    
    // Check if image_url is a placeholder or empty
    const isPlaceholder = hasImageUrl && (
      ebike.image_url.includes('placeholder') ||
      ebike.image_url.includes('/api/placeholder') ||
      ebike.image_url.startsWith('data:image')
    );
    
    if (!hasImageUrl || isPlaceholder || !hasImages) {
      console.log(`\n🔍 Checking: ${ebike.brand} ${ebike.model_name}`);
      
      // Try to find images in public/img
      const availableImages = getAvailableImages(ebike.brand, ebike.model_name);
      
      if (availableImages.length > 0) {
        console.log(`   ✅ Found ${availableImages.length} images`);
        
        // Update image_url and images array
        ebike.image_url = availableImages[0];
        ebike.images = availableImages;
        
        fixed++;
      } else {
        console.log(`   ❌ No images found in public/img`);
        missing++;
      }
    }
  }
  
  // Write updated JSON
  if (fixed > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(ebikes, null, 2), 'utf-8');
    console.log(`\n✅ Fixed ${fixed} e-bikes with missing images`);
    console.log(`⚠️  ${missing} e-bikes still missing images`);
  } else {
    console.log(`\n✅ All e-bikes have images!`);
  }
}

fixMissingImages().catch(console.error);


