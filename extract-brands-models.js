const fs = require('fs');

// Read the e-bikes data
const ebikesData = JSON.parse(fs.readFileSync('./src/data/ebikes.json', 'utf8'));

console.log('🚴 E-Bike Brands and Models in the App:\n');
console.log('=' .repeat(50));

// Group by brand for better organization
const brands = {};

ebikesData.forEach(ebike => {
  if (!brands[ebike.brand]) {
    brands[ebike.brand] = [];
  }
  brands[ebike.brand].push(ebike.model_name);
});

// Display organized by brand
Object.keys(brands).sort().forEach(brand => {
  console.log(`\n📱 ${brand}:`);
  brands[brand].forEach(model => {
    console.log(`   • ${model}`);
  });
});

console.log('\n' + '=' .repeat(50));
console.log(`\n📊 Total: ${ebikesData.length} e-bikes from ${Object.keys(brands).length} brands`);

// Also create a simple list
console.log('\n📋 Complete List (Brand + Model):');
console.log('=' .repeat(50));
ebikesData.forEach((ebike, index) => {
  console.log(`${index + 1}. ${ebike.brand} ${ebike.model_name}`);
});
