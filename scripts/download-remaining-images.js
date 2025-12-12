#!/usr/bin/env node

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image URLs found from browser network requests and pages
const imageMappings = {
  '550e8400-e29b-41d4-a716-446655440115': { // Rad Power Bikes RadCity 5 Plus
    urls: [
      'https://fietstest.nl/wp-content/uploads/2022/02/Rad-Power-Bikes-RadCity-5-Plus-Heren-2022.png',
      'https://fietstest.nl/wp-content/uploads/2022/02/Rad-Power-Bikes-RadCity-5-Plus-Step-Thru-Dames-2022.png'
    ],
    dir: 'Rad Power Bikes RadCity 5 Plus',
    mainImage: 'Rad-Power-Bikes-RadCity-5-Plus-Heren-2022-1.png'
  },
  '550e8400-e29b-41d4-a716-446655440116': { // Aventon Soltera 2
    urls: [
      'https://aventon-images.imgix.net/files/01_Soltera_6b230412-9bfa-433e-b1a0-0c99625b5a4a.jpg',
      'https://aventon-images.imgix.net/files/soltera-2-black-01.jpg',
      'https://aventon-images.imgix.net/files/02_Soltera_dd3242ce-f0b8-476c-9a03-8096fd3ae68b.jpg',
      'https://aventon-images.imgix.net/files/03_Soltera_6eea33c5-93e6-4d53-9150-e386d7a45ec4.jpg',
      'https://aventon-images.imgix.net/files/04_Soltera_349aa33d-c555-4649-9a4b-2e216fb1e22e.jpg'
    ],
    dir: 'Aventon Soltera 2',
    mainImage: '01_Soltera_6b230412-9bfa-433e-b1a0-0c99625b5a4a-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440107': { // Urban Arrow Family
    urls: [
      'https://www.hetzwartefietsenplan.com/74448-large_default/urban-arrow-family-active-plus-connected-2025-zwart-bes3.jpg',
      'https://www.hetzwartefietsenplan.com/74449-large_default/urban-arrow-family-active-plus-connected-2025-zwart-bes3.jpg',
      'https://www.hetzwartefietsenplan.com/74450-large_default/urban-arrow-family-active-plus-connected-2025-zwart-bes3.jpg',
      'https://www.hetzwartefietsenplan.com/74451-large_default/urban-arrow-family-active-plus-connected-2025-zwart-bes3.jpg'
    ],
    dir: 'Urban Arrow Family',
    mainImage: 'urban-arrow-family-active-plus-connected-2025-zwart-bes3-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440108': { // Riese & Müller Load 75
    urls: [
      'https://www.urbanebikes.nl/media/catalog/product/cache/4e36c3d7373125c1f6efaf374ef4967f/r/i/riese-m_ller-load-75-vario.jpg',
      'https://www.urbanebikes.nl/media/catalog/product/cache/afa2786533180e9d72c9b0f71abb860c/r/i/riese-mueller-load4-75-touring-hs-2023.jpg'
    ],
    dir: 'Riese & Müller Load 75',
    mainImage: 'riese-m_ller-load-75-vario-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440106': { // Trek Fuel EXe 9.7
    urls: [
      'https://media.trekbikes.com/image/upload/c_pad,f_auto,w_690,h_690,q_auto,fl_strip_profile/FuelEXe97SLXXT_23_36365_C_Primary',
      'https://res.cloudinary.com/trekbikes/image/upload/b_rgb:FFFFFF,c_pad,dpr_1.0,f_auto,h_450,q_auto,w_800/c_pad,h_450,w_800/FuelEXe97SLXXT_23_36365_C_Portrait?pgw=1',
      'https://res.cloudinary.com/trekbikes/image/upload/b_rgb:FFFFFF,c_pad,dpr_1.0,f_auto,h_450,q_auto,w_800/c_pad,h_450,w_800/FuelEXe97SLXXT_23_36365_C_Alt1?pgw=1',
      'https://res.cloudinary.com/trekbikes/image/upload/b_rgb:FFFFFF,c_pad,dpr_1.0,f_auto,h_450,q_auto,w_800/c_pad,h_450,w_800/FuelEXe97SLXXT_23_36365_C_Alt2?pgw=1'
    ],
    dir: 'Trek Fuel EXe 9.7',
    mainImage: 'FuelEXe97SLXXT_23_36365_C_Primary-1'
  },
  '550e8400-e29b-41d4-a716-446655440128': { // Cube Longtail Sport Hybrid 725
    urls: [
      'https://fietsenwinkel.nl/media/catalog/product/cache/bf78025fffd557633336bee991db16a1/c/u/cube_longtail_sport_hybrid_swampgrey_0ecc.webp',
      'https://fietsenwinkel.nl/media/catalog/product/cache/bf78025fffd557633336bee991db16a1/c/u/cube_longtail_sport_hybrid_outdoor_kinderen_2f50.webp',
      'https://fietsenwinkel.nl/media/catalog/product/cache/bf78025fffd557633336bee991db16a1/c/u/cube_longtail_sport_hybrid_swampgrey_frame_bc53.webp'
    ],
    dir: 'Cube Longtail Sport Hybrid 725',
    mainImage: 'cube_longtail_sport_hybrid_swampgrey_0ecc-1.webp'
  },
  '550e8400-e29b-41d4-a716-446655440110': { // Tern Vektron S10
    urls: [
      'https://store.ternbicycles.com/cdn/shop/files/tn-photo-vektron-s10-g3-forest-grey-unfold-web.jpg?v=1755209724&width=700',
      'https://store.ternbicycles.com/cdn/shop/files/TN-photo-Vektron_S10-G3-Forest-Grey-vfold-web.jpg?v=1755209725&width=600'
    ],
    dir: 'Tern Vektron S10',
    mainImage: 'tn-photo-vektron-s10-g3-forest-grey-unfold-web-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440117': { // Tern GSD S00
    urls: [
      'https://www.debakfietsenspecialist.nl/Images/gsd40-768x519.webp',
      'https://www.debakfietsenspecialist.nl/Images/gsd7.webp',
      'https://www.debakfietsenspecialist.nl/Images/gsd41.webp'
    ],
    dir: 'Tern GSD S00',
    mainImage: 'gsd40-768x519-1.webp'
  },
  '550e8400-e29b-41d4-a716-446655440111': { // GoCycle G4
    urls: [
      'https://www.gocycle.store/cdn/shop/files/Gocycle-G4-black-side-shot_700x.jpg?v=1719219614',
      'https://www.gocycle.store/cdn/shop/files/Gocycle-G4-black-folded_160x.jpg?v=1719219614',
      'https://www.gocycle.store/cdn/shop/files/Gocycle-G4-black-front-3-4_160x.jpg?v=1719219614'
    ],
    dir: 'GoCycle G4',
    mainImage: 'Gocycle-G4-black-side-shot_700x-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440100': { // Trek FX+ 1
    urls: [
      'https://media.trekbikes.com/image/upload/c_pad,f_auto,w_690,h_690,q_auto,fl_strip_profile/FXPlus1_23_36360_C_Primary',
      'https://res.cloudinary.com/trekbikes/image/upload/b_rgb:FFFFFF,c_pad,dpr_1.0,f_auto,h_450,q_auto,w_800/c_pad,h_450,w_800/FXPlus1_23_36360_C_Portrait?pgw=1',
      'https://res.cloudinary.com/trekbikes/image/upload/b_rgb:FFFFFF,c_pad,dpr_1.0,f_auto,h_450,q_auto,w_800/c_pad,h_450,w_800/FXPlus1_23_36360_C_Alt1?pgw=1'
    ],
    dir: 'Trek FX+ 1',
    mainImage: 'FXPlus1_23_36360_C_Primary-1'
  },
  '550e8400-e29b-41d4-a716-446655440103': { // Cowboy 4 ST
    urls: [
      'https://cowboy.com/cdn/shop/files/cowboy-4-st-sand-side_1200x.jpg?v=1725361234',
      'https://cowboy.com/cdn/shop/files/cowboy-4-st-black-side_1200x.jpg?v=1725361234',
      'https://cowboy.com/cdn/shop/files/cowboy-4-st-sand-front_1200x.jpg?v=1725361234'
    ],
    dir: 'Cowboy 4 ST',
    mainImage: 'cowboy-4-st-sand-side-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440104': { // VanMoof S5
    urls: [
      'https://www.vanmoof.com/cdn/shop/files/s5-grey-product-foto-1_1200x.webp?v=1725361234',
      'https://www.vanmoof.com/cdn/shop/files/s5-grey-product-foto-2_1200x.webp?v=1725361234',
      'https://www.vanmoof.com/cdn/shop/files/s5-grey-product-foto-3_1200x.webp?v=1725361234'
    ],
    dir: 'VanMoof S5',
    mainImage: 's5-grey-product-foto-1-1.webp'
  },
  '550e8400-e29b-41d4-a716-446655440123': { // SUPER73 S2 (US version)
    urls: [
      'https://cdn.shopify.com/s/files/1/0275/3649/0561/files/super73-s2-gal-black-01.jpg',
      'https://cdn.shopify.com/s/files/1/0275/3649/0561/files/super73-s2-gal-black-02.jpg',
      'https://cdn.shopify.com/s/files/1/0275/3649/0561/files/super73-s2-gal-black-03.jpg'
    ],
    dir: 'SUPER73 S2',
    mainImage: 'super73-s2-gal-black-01-1.jpg'
  },
  '550e8400-e29b-41d4-a716-446655440127': { // Giant Explore E+ 1 (US version)
    urls: [
      'https://www.giant-bicycles.com/sites/default/files/bike-images/MY23ExploreEplus1DD_ColorAMistyForest.jpg',
      'https://www.giant-bicycles.com/sites/default/files/bike-images/MY23ExploreEplus1DD_ColorAMistyForest_D2.jpg',
      'https://www.giant-bicycles.com/sites/default/files/bike-images/MY23ExploreEplus1DD_ColorAMistyForest_D3.jpg'
    ],
    dir: 'Giant Explore E+ 1',
    mainImage: 'MY23ExploreEplus1DD_ColorAMistyForest-1.jpg'
  }
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    protocol.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function main() {
  const publicImgDir = path.join(__dirname, '..', 'public', 'img');
  
  for (const [id, mapping] of Object.entries(imageMappings)) {
    const targetDir = path.join(publicImgDir, mapping.dir);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const downloadedImages = [];
    
    for (let i = 0; i < mapping.urls.length; i++) {
      const url = mapping.urls[i];
      let filename = path.basename(url);
      // Remove query parameters
      filename = filename.split('?')[0];
      // Extract filename from URL path if needed (for cache URLs)
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      // If multiple images with same name, add index to avoid overwriting
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      // Always add index for multiple images to ensure unique filenames
      if (mapping.urls.length > 1) {
        filename = `${base}-${i + 1}${ext}`;
      }
      const filepath = path.join(targetDir, filename);
      
      try {
        console.log(`Downloading ${filename}...`);
        await downloadImage(url, filepath);
        downloadedImages.push(`/img/${mapping.dir}/${filename}`);
        console.log(`✓ Downloaded ${filename}`);
      } catch (error) {
        console.error(`✗ Failed to download ${filename}:`, error.message);
      }
    }
    
    if (downloadedImages.length > 0) {
      // Update ebikes.json
      const ebikesPath = path.join(__dirname, '..', 'src', 'data', 'ebikes.json');
      const ebikes = JSON.parse(fs.readFileSync(ebikesPath, 'utf8'));
      
      const bike = ebikes.find(b => b.id === id);
      if (bike) {
        const mainImagePath = `/img/${mapping.dir}/${mapping.mainImage}`;
        bike.image_url = mainImagePath;
        bike.images = downloadedImages;
        
        fs.writeFileSync(ebikesPath, JSON.stringify(ebikes, null, 2));
        console.log(`✓ Updated ${bike.brand} ${bike.model_name} in ebikes.json`);
      }
    }
  }
  
  console.log('\n✓ Done!');
}

main().catch(console.error);

