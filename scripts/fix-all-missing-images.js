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
  
  // Normalize brand and model for matching
  const normalize = (str) => str.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const brandNorm = normalize(brand || '');
  const modelNorm = normalize(modelName || '');
  
  // Try different possible directory names
  const possibleDirs = [
    `${brand} ${modelName}`, // Exact match
    `${brandNorm} ${modelNorm}`, // Normalized
    `${brand} ${modelName.replace(/[^a-zA-Z0-9\s]/g, '')}`, // Brand + normalized model
    modelName, // Just model
    modelNorm, // Just normalized model
    brand, // Just brand
    brandNorm, // Just normalized brand
  ];
  
  // Also try with common variations
  if (modelName) {
    possibleDirs.push(
      modelName.replace(/\s+/g, ' '), // Normalize spaces
      modelName.toUpperCase(),
      modelName.toLowerCase(),
    );
  }
  
  // Remove duplicates
  const uniqueDirs = [...new Set(possibleDirs.filter(d => d && d.trim()))];
  
  for (const dirName of uniqueDirs) {
    const dirPath = path.join(imgDir, dirName);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath);
      const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .sort(); // Sort for consistent ordering
      
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

// Check if image URL is a placeholder
function isPlaceholder(imageUrl) {
  if (!imageUrl || imageUrl.trim() === '') {
    return true;
  }
  return (
    imageUrl.includes('placeholder') ||
    imageUrl.includes('/api/placeholder') ||
    imageUrl.startsWith('data:image')
  );
}

// Process a single e-bike
function processEBike(ebike, filePath) {
  const hasImageUrl = ebike.image_url && ebike.image_url.trim() !== '';
  const hasImages = ebike.images && Array.isArray(ebike.images) && ebike.images.length > 0;
  const imageUrlIsPlaceholder = hasImageUrl && isPlaceholder(ebike.image_url);
  
  // Check if images array contains only placeholders
  const imagesArePlaceholders = hasImages && ebike.images.every(img => isPlaceholder(img));
  
  if (!hasImageUrl || imageUrlIsPlaceholder || !hasImages || imagesArePlaceholders) {
    const availableImages = getAvailableImages(ebike.brand, ebike.model_name);
    
    if (availableImages.length > 0) {
      ebike.image_url = availableImages[0];
      ebike.images = availableImages;
      return { fixed: true, found: availableImages.length };
    } else {
      return { fixed: false, found: 0 };
    }
  }
  
  return { fixed: false, found: 0, skipped: true };
}

// Process a JSON file
function processJsonFile(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);
    
    // Handle both array and object with array property
    let ebikes = Array.isArray(data) ? data : (data.ebikes || []);
    
    if (!Array.isArray(ebikes)) {
      console.log(`⚠️  Skipping ${filePath}: not an array`);
      return { fixed: 0, missing: 0, skipped: 0 };
    }
    
    let fixed = 0;
    let missing = 0;
    let skipped = 0;
    
    for (let i = 0; i < ebikes.length; i++) {
      const result = processEBike(ebikes[i], filePath);
      
      if (result.fixed) {
        fixed++;
        console.log(`   ✅ ${ebikes[i].brand} ${ebikes[i].model_name}: Found ${result.found} images`);
      } else if (result.skipped) {
        skipped++;
      } else {
        missing++;
        console.log(`   ❌ ${ebikes[i].brand} ${ebikes[i].model_name}: No images found`);
      }
    }
    
    // Write back if we fixed anything
    if (fixed > 0) {
      const output = Array.isArray(data) ? ebikes : { ...data, ebikes };
      fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
    }
    
    return { fixed, missing, skipped };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { fixed: 0, missing: 0, skipped: 0, error: true };
  }
}

async function fixAllMissingImages() {
  console.log('🔍 Scanning for missing images across all JSON files...\n');
  
  const baseDir = path.join(__dirname, '..');
  const filesToProcess = [
    path.join(baseDir, 'src/data/ebikes.json'),
    path.join(baseDir, 'public/ebikes-data.json'),
    path.join(baseDir, 'src/data/categories/budget.json'),
    path.join(baseDir, 'src/data/categories/city-commuter.json'),
    path.join(baseDir, 'src/data/categories/fat-tire.json'),
    path.join(baseDir, 'src/data/categories/folding.json'),
    path.join(baseDir, 'src/data/categories/cargo.json'),
    path.join(baseDir, 'src/data/categories/mountain-emtb.json'),
    path.join(baseDir, 'src/data/categories/premium.json'),
    path.join(baseDir, 'src/data/categories/trekking-touring.json'),
  ];
  
  let totalFixed = 0;
  let totalMissing = 0;
  let totalSkipped = 0;
  
  for (const filePath of filesToProcess) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    console.log(`\n📄 Processing: ${path.relative(baseDir, filePath)}`);
    const result = processJsonFile(filePath);
    
    totalFixed += result.fixed || 0;
    totalMissing += result.missing || 0;
    totalSkipped += result.skipped || 0;
    
    if (result.fixed > 0) {
      console.log(`   ✅ Fixed ${result.fixed} products`);
    }
    if (result.missing > 0) {
      console.log(`   ⚠️  ${result.missing} products still missing images`);
    }
    if (result.skipped > 0) {
      console.log(`   ℹ️  ${result.skipped} products already have images`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Fixed: ${totalFixed} products`);
  console.log(`   ⚠️  Missing: ${totalMissing} products`);
  console.log(`   ℹ️  Skipped: ${totalSkipped} products (already have images)`);
  console.log('='.repeat(50));
  
  if (totalFixed > 0) {
    console.log('\n✅ Successfully updated JSON files with image paths!');
  } else {
    console.log('\n✅ All products already have images or no images found to update.');
  }
}

fixAllMissingImages().catch(console.error);


