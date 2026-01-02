const fs = require('fs');
const path = require('path');

// Read ebikes.json
const ebikesData = JSON.parse(fs.readFileSync('./src/data/ebikes.json', 'utf8'));

// Collect all image references
const imageRefs = new Set();
ebikesData.forEach(ebike => {
  if (ebike.image_url) {
    imageRefs.add(ebike.image_url);
  }
  if (ebike.images && Array.isArray(ebike.images)) {
    ebike.images.forEach(img => imageRefs.add(img));
  }
});

console.log(`Total unique image references: ${imageRefs.size}\n`);

// Check which images exist
const publicImgDir = './public/img';
const missing = [];
const found = [];

Array.from(imageRefs).forEach(imgPath => {
  if (imgPath.startsWith('/img/')) {
    // Remove leading /img/ to get relative path
    const relativePath = imgPath.replace(/^\/img\//, '');
    const filePath = path.join(publicImgDir, relativePath);
    
    if (fs.existsSync(filePath)) {
      found.push(imgPath);
    } else {
      missing.push({
        path: imgPath,
        expectedLocation: filePath,
        relativePath: relativePath
      });
    }
  }
});

console.log(`Found images: ${found.length}`);
console.log(`Missing images: ${missing.length}\n`);

if (missing.length > 0) {
  console.log('=== MISSING IMAGES ===\n');
  missing.forEach(({ path: imgPath, expectedLocation, relativePath }) => {
    console.log(`Missing: ${imgPath}`);
    console.log(`  Expected at: ${expectedLocation}`);
    console.log(`  Relative path: ${relativePath}\n`);
  });
  
  // Group by folder
  const byFolder = {};
  missing.forEach(({ relativePath }) => {
    const folder = path.dirname(relativePath);
    if (!byFolder[folder]) {
      byFolder[folder] = [];
    }
    byFolder[folder].push(path.basename(relativePath));
  });
  
  console.log('\n=== MISSING IMAGES BY FOLDER ===\n');
  Object.keys(byFolder).sort().forEach(folder => {
    console.log(`Folder: ${folder}`);
    byFolder[folder].forEach(file => {
      console.log(`  - ${file}`);
    });
    console.log('');
  });
  
  // Save to file
  fs.writeFileSync('missing-images-report.json', JSON.stringify({
    total: missing.length,
    found: found.length,
    missing: missing
  }, null, 2));
  console.log('\n✅ Report saved to missing-images-report.json');
} else {
  console.log('✅ All images are present!');
}


