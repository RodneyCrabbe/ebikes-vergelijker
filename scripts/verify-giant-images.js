#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON data
const dataPath = path.join(__dirname, '../public/ebikes-data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const ebikes = JSON.parse(rawData);

// Find Giant products
const giantProducts = ebikes.filter(e => 
  e.brand === 'Giant' && 
  (e.model_name === 'Explore E+' || e.model_name === 'Explore E+ 1' || e.model_name === 'Trance E+ 3')
);

console.log(`Found ${giantProducts.length} Giant products:\n`);

giantProducts.forEach(ebike => {
  console.log(`\n${ebike.brand} ${ebike.model_name}:`);
  console.log(`  ID: ${ebike.id}`);
  console.log(`  Image URL: ${ebike.image_url || 'MISSING'}`);
  console.log(`  Images array: ${ebike.images ? ebike.images.length : 0} images`);
  
  if (ebike.images && ebike.images.length > 0) {
    console.log(`  First image: ${ebike.images[0]}`);
    
    // Check if file exists
    const firstImagePath = path.join(__dirname, '..', 'public', ebike.images[0]);
    const exists = fs.existsSync(firstImagePath);
    console.log(`  File exists: ${exists ? 'YES' : 'NO'}`);
    if (!exists) {
      console.log(`  ⚠️  WARNING: Image file not found at: ${firstImagePath}`);
    }
  } else {
    console.log(`  ⚠️  WARNING: No images in images array!`);
  }
  
  if (!ebike.image_url) {
    console.log(`  ⚠️  WARNING: No image_url set!`);
  }
});

// Check src/data/ebikes.json too
const srcDataPath = path.join(__dirname, '../src/data/ebikes.json');
if (fs.existsSync(srcDataPath)) {
  const srcRawData = fs.readFileSync(srcDataPath, 'utf-8');
  const srcEbikes = JSON.parse(srcRawData);
  const srcGiantProducts = srcEbikes.filter(e => 
    e.brand === 'Giant' && 
    (e.model_name === 'Explore E+' || e.model_name === 'Explore E+ 1' || e.model_name === 'Trance E+ 3')
  );
  
  console.log(`\n\nIn src/data/ebikes.json: Found ${srcGiantProducts.length} Giant products`);
  
  srcGiantProducts.forEach(ebike => {
    console.log(`\n${ebike.brand} ${ebike.model_name}:`);
    console.log(`  Image URL: ${ebike.image_url || 'MISSING'}`);
    console.log(`  Images array: ${ebike.images ? ebike.images.length : 0} images`);
  });
}

