const fs = require('fs');
const path = require('path');

// Read all category files
const categoriesDir = 'src/data/categories';
const categoryFiles = fs.readdirSync(categoriesDir).filter(file => file.endsWith('.json') && file !== 'metadata.json');

let allEBikes = [];

console.log('Reconstructing full dataset from category files...');

categoryFiles.forEach(file => {
  const filePath = path.join(categoriesDir, file);
  const categoryData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (Array.isArray(categoryData)) {
    allEBikes = allEBikes.concat(categoryData);
    console.log(`Added ${categoryData.length} e-bikes from ${file}`);
  }
});

console.log(`Total e-bikes reconstructed: ${allEBikes.length}`);

// Write the full dataset
fs.writeFileSync('src/data/ebikes.json', JSON.stringify(allEBikes, null, 2));
console.log('Full dataset written to src/data/ebikes.json');

// Verify the file
const verification = JSON.parse(fs.readFileSync('src/data/ebikes.json', 'utf8'));
console.log(`Verification: ${verification.length} e-bikes in final file`);
