#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkImageExists(imagePath) {
  // Remove query parameters (e.g., ?v=1760346847501)
  const cleanPath = imagePath.split('?')[0];
  // Remove leading slash and check in public directory
  const pathWithoutSlash = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  const fullPath = path.join(__dirname, '../public', pathWithoutSlash);
  return fs.existsSync(fullPath);
}

async function verifyAllImages() {
  console.log('🔍 Verifying all image paths...');
  
  const dataPath = path.join(__dirname, '../src/data/ebikes.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const ebikes = JSON.parse(rawData);
  
  let missingMain = 0;
  let missingInArray = 0;
  let fixed = 0;
  
  for (let i = 0; i < ebikes.length; i++) {
    const ebike = ebikes[i];
    const brand = ebike.brand;
    const model = ebike.model_name;
    
    // Check main image_url
    if (ebike.image_url) {
      if (!checkImageExists(ebike.image_url)) {
        console.log(`\n❌ ${brand} ${model}: Main image missing: ${ebike.image_url}`);
        missingMain++;
        
        // Try to find images in public/img
        const imgDir = path.join(__dirname, '../public/img');
        
        // Get all directories in img folder
        const allDirs = fs.existsSync(imgDir) ? fs.readdirSync(imgDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name) : [];
        
        // Try different possible directory names
        const possibleDirs = [
          `${brand} ${model}`,
          `${brand} ${model.replace(/[^a-zA-Z0-9\s]/g, '')}`,
          `${brand} - ${model}`,
          `${brand}-${model}`,
          `${brand}`,
          model,
          model.replace(/[^a-zA-Z0-9\s]/g, ''),
          // Try fuzzy matching
          ...allDirs.filter(dir => 
            dir.toLowerCase().includes(brand.toLowerCase()) && 
            dir.toLowerCase().includes(model.toLowerCase())
          ),
          ...allDirs.filter(dir => 
            dir.toLowerCase().includes(brand.toLowerCase()) || 
            dir.toLowerCase().includes(model.toLowerCase())
          )
        ];
        
        let foundImages = [];
        for (const dirName of possibleDirs) {
          const dirPath = path.join(imgDir, dirName);
          if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            const imageFiles = files.filter(file => 
              /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
            );
            
            for (const file of imageFiles) {
              foundImages.push(`/img/${dirName}/${file}`);
            }
            
            if (foundImages.length > 0) {
              break;
            }
          }
        }
        
        if (foundImages.length > 0) {
          console.log(`   ✅ Found ${foundImages.length} images, updating...`);
          ebike.image_url = foundImages[0];
          ebike.images = foundImages;
          fixed++;
        }
      }
    } else {
      console.log(`\n⚠️  ${brand} ${model}: No image_url`);
    }
    
    // Check images array
    if (ebike.images && Array.isArray(ebike.images)) {
      const missingImages = ebike.images.filter(img => !checkImageExists(img));
      if (missingImages.length > 0) {
        console.log(`\n⚠️  ${brand} ${model}: ${missingImages.length} images in array missing:`);
        missingImages.forEach(img => console.log(`      - ${img}`));
        missingInArray++;
        
        // Remove query parameters and filter out missing images
        ebike.images = ebike.images
          .map(img => img.split('?')[0]) // Remove query parameters
          .filter(img => checkImageExists(img));
        
        // If no images left, try to find new ones
        if (ebike.images.length === 0 && !ebike.image_url) {
          const imgDir = path.join(__dirname, '../public/img');
          const possibleDirs = [
            `${brand} ${model}`,
            `${brand} ${model.replace(/[^a-zA-Z0-9\s]/g, '')}`,
            `${brand}`,
            model
          ];
          
          for (const dirName of possibleDirs) {
            const dirPath = path.join(imgDir, dirName);
            if (fs.existsSync(dirPath)) {
              const files = fs.readdirSync(dirPath);
              const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
              );
              
              if (imageFiles.length > 0) {
                ebike.images = imageFiles.map(file => `/img/${dirName}/${file}`);
                ebike.image_url = ebike.images[0];
                console.log(`   ✅ Found ${ebike.images.length} new images`);
                fixed++;
                break;
              }
            }
          }
        }
      }
    }
  }
  
  if (fixed > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(ebikes, null, 2), 'utf-8');
    console.log(`\n✅ Fixed ${fixed} e-bikes`);
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   E-bikes with missing main image: ${missingMain}`);
  console.log(`   E-bikes with missing images in array: ${missingInArray}`);
  console.log(`   Total fixed: ${fixed}`);
}

verifyAllImages().catch(console.error);

