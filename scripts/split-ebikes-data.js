const fs = require('fs');
const path = require('path');

// Read the large JSON file
const allEBikes = JSON.parse(fs.readFileSync('src/data/ebikes.json', 'utf8'));

console.log(`Total e-bikes to split: ${allEBikes.length}`);

// Define categories based on bike types and brands
const categories = {
  'city-commuter': [],
  'mountain-emtb': [],
  'cargo': [],
  'folding': [],
  'trekking-touring': [],
  'fat-tire': [],
  'premium': [],
  'budget': []
};

// Categorize e-bikes
allEBikes.forEach(ebike => {
  const brand = ebike.brand.toLowerCase();
  const model = ebike.model_name.toLowerCase();
  const price = ebike.price || 0;
  
  // Categorize based on model name and brand
  if (model.includes('cargo') || model.includes('load') || model.includes('family') || 
      model.includes('gsd') || model.includes('longtail') || brand.includes('urban arrow') || 
      brand.includes('riese') || brand.includes('tern')) {
    categories['cargo'].push(ebike);
  } else if (model.includes('fold') || model.includes('vektron') || 
             brand.includes('brompton') || brand.includes('gocycle') || brand.includes('tern')) {
    categories['folding'].push(ebike);
  } else if (model.includes('mountain') || model.includes('levo') || model.includes('fuel') || 
             model.includes('trance') || model.includes('stereo') || model.includes('hybrid')) {
    categories['mountain-emtb'].push(ebike);
  } else if (model.includes('fat') || model.includes('phatfour') || brand.includes('super73')) {
    categories['fat-tire'].push(ebike);
  } else if (model.includes('trek') || model.includes('explore') || model.includes('endeavour') || 
             model.includes('charger') || model.includes('vado')) {
    categories['trekking-touring'].push(ebike);
  } else if (price > 4000) {
    categories['premium'].push(ebike);
  } else if (price < 2000) {
    categories['budget'].push(ebike);
  } else {
    categories['city-commuter'].push(ebike);
  }
});

// Create category files
Object.entries(categories).forEach(([categoryName, ebikes]) => {
  if (ebikes.length > 0) {
    const filePath = `src/data/categories/${categoryName}.json`;
    fs.writeFileSync(filePath, JSON.stringify(ebikes, null, 2));
    console.log(`Created ${filePath} with ${ebikes.length} e-bikes`);
  }
});

// Create a metadata file with category information
const metadata = {
  totalEBikes: allEBikes.length,
  categories: Object.entries(categories).map(([name, ebikes]) => ({
    name,
    count: ebikes.length,
    file: `${name}.json`
  })).filter(cat => cat.count > 0),
  lastUpdated: new Date().toISOString()
};

fs.writeFileSync('src/data/categories/metadata.json', JSON.stringify(metadata, null, 2));
console.log('Created metadata.json');

// Create a smaller main file with just the first 10 e-bikes for initial load
const initialEBikes = allEBikes.slice(0, 10);
fs.writeFileSync('src/data/ebikes.json', JSON.stringify(initialEBikes, null, 2));
console.log(`Created main ebikes.json with ${initialEBikes.length} e-bikes for initial load`);

console.log('Data splitting completed successfully!');
