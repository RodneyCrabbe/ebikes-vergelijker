#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env file manually if it exists
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=:#]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    });
  }
} catch (error) {
  // Ignore if .env doesn't exist or can't be read
  console.warn('Warning: Could not read .env file:', error.message);
}

const WP_API_URL = process.env.VITE_WP_API_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

async function getJwtToken() {
  if (!WP_API_URL || !WP_USERNAME || !WP_PASSWORD) {
    throw new Error('Missing WP credentials in environment variables. Set VITE_WP_API_URL, WP_USERNAME, and WP_PASSWORD in .env');
  }

  try {
    console.log('🔐 Authenticating with WordPress...');
    const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: WP_USERNAME,
        password: WP_PASSWORD,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('Failed to get JWT token: ' + JSON.stringify(data));
    }
    return data.token;
  } catch (error) {
    console.error('❌ Auth Error:', error);
    throw error;
  }
}

async function getExistingEBikes(token) {
  try {
    console.log('📥 Fetching existing e-bikes from WordPress...');
    const response = await fetch(`${WP_API_URL}/wp/v2/ebike?per_page=100&_fields=id,title,acf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch e-bikes: ${response.status}`);
    }

    const posts = await response.json();
    // Create a map of title -> post ID for quick lookup
    const map = new Map();
    posts.forEach(post => {
      const title = post.title?.rendered || post.title;
      map.set(title.toLowerCase(), post.id);
    });
    return map;
  } catch (error) {
    console.error('❌ Error fetching existing e-bikes:', error);
    throw error;
  }
}

async function updateEBike(token, postId, ebike) {
  const acfFields = {
    brand: ebike.brand,
    model_name: ebike.model_name,
    version: ebike.version || '',
    price: ebike.price || 0,
    currency: ebike.currency || 'EUR',
    build_date: ebike.build_date || null,
    gender_type: ebike.gender_type || 'unisex',
    action_radius_km: ebike.action_radius_km || null,
    action_radius_text: ebike.action_radius_text || null,
    battery_capacity: ebike.battery_capacity || null,
    top_speed_kmh: ebike.top_speed_kmh || null,
    top_speed_text: ebike.top_speed_text || null,
    image_url: ebike.image_url || '',
    images: ebike.images || [],
    affiliate_url: ebike.affiliate_url || '',
    cpl_rate: ebike.cpl_rate || 0,
    bike_type: ebike.bike_type || null,
    color: ebike.color || null,
    motor_location: ebike.motor_location || null,
    removable_battery: ebike.removable_battery ? 1 : 0,
    on_sale: ebike.on_sale ? 1 : 0,
    weight_kg: ebike.weight_kg || null,
    wheel_size: ebike.wheel_size || null,
    tire_size: ebike.tire_size || null,
    frame_material: ebike.frame_material || null,
    motor_type: ebike.motor_type || null,
    motor_power_w: ebike.motor_power_w || null,
    torque_nm: ebike.torque_nm || null,
    battery_type: ebike.battery_type || null,
    battery_voltage: ebike.battery_voltage || null,
    battery_ah: ebike.battery_ah || null,
    charging_time_hours: ebike.charging_time_hours || null,
    brake_type: ebike.brake_type || null,
    gear_system: ebike.gear_system || null,
    suspension: ebike.suspension || null,
    lighting: ebike.lighting || null,
    display: ebike.display || null,
    warranty_years: ebike.warranty_years || null,
    certification: ebike.certification || null,
    colors: ebike.colors ? JSON.stringify(ebike.colors) : null,
    highlights: ebike.highlights ? JSON.stringify(ebike.highlights) : null,
    specifications: ebike.specifications ? JSON.stringify(ebike.specifications) : null,
    features: ebike.features ? JSON.stringify(ebike.features) : null,
  };

  const postData = {
    title: `${ebike.brand} ${ebike.model_name}`,
    content: ebike.description || '',
    status: 'publish',
    acf: acfFields
  };

  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/ebike/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Update failed: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating ${ebike.model_name}:`, error.message);
    throw error;
  }
}

async function createEBike(token, ebike) {
  const acfFields = {
    brand: ebike.brand,
    model_name: ebike.model_name,
    version: ebike.version || '',
    price: ebike.price || 0,
    currency: ebike.currency || 'EUR',
    build_date: ebike.build_date || null,
    gender_type: ebike.gender_type || 'unisex',
    action_radius_km: ebike.action_radius_km || null,
    action_radius_text: ebike.action_radius_text || null,
    battery_capacity: ebike.battery_capacity || null,
    top_speed_kmh: ebike.top_speed_kmh || null,
    top_speed_text: ebike.top_speed_text || null,
    image_url: ebike.image_url || '',
    images: ebike.images || [],
    affiliate_url: ebike.affiliate_url || '',
    cpl_rate: ebike.cpl_rate || 0,
    bike_type: ebike.bike_type || null,
    color: ebike.color || null,
    motor_location: ebike.motor_location || null,
    removable_battery: ebike.removable_battery ? 1 : 0,
    on_sale: ebike.on_sale ? 1 : 0,
    weight_kg: ebike.weight_kg || null,
    wheel_size: ebike.wheel_size || null,
    tire_size: ebike.tire_size || null,
    frame_material: ebike.frame_material || null,
    motor_type: ebike.motor_type || null,
    motor_power_w: ebike.motor_power_w || null,
    torque_nm: ebike.torque_nm || null,
    battery_type: ebike.battery_type || null,
    battery_voltage: ebike.battery_voltage || null,
    battery_ah: ebike.battery_ah || null,
    charging_time_hours: ebike.charging_time_hours || null,
    brake_type: ebike.brake_type || null,
    gear_system: ebike.gear_system || null,
    suspension: ebike.suspension || null,
    lighting: ebike.lighting || null,
    display: ebike.display || null,
    warranty_years: ebike.warranty_years || null,
    certification: ebike.certification || null,
    colors: ebike.colors ? JSON.stringify(ebike.colors) : null,
    highlights: ebike.highlights ? JSON.stringify(ebike.highlights) : null,
    specifications: ebike.specifications ? JSON.stringify(ebike.specifications) : null,
    features: ebike.features ? JSON.stringify(ebike.features) : null,
  };

  const postData = {
    title: `${ebike.brand} ${ebike.model_name}`,
    content: ebike.description || '',
    status: 'publish',
    acf: acfFields
  };

  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/ebike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Create failed: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error creating ${ebike.model_name}:`, error.message);
    throw error;
  }
}

async function syncEBikes() {
  console.log('🚀 Starting sync to WordPress...');
  
  // Read local JSON file
  const dataPath = path.join(__dirname, '../src/data/ebikes.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const ebikes = JSON.parse(rawData);

  console.log(`📊 Found ${ebikes.length} e-bikes in local JSON.`);

  let token;
  try {
    token = await getJwtToken();
    console.log('✅ Authenticated with WordPress');
  } catch (error) {
    console.error('❌ Authentication failed. Please check your .env file.');
    console.error('Required variables: VITE_WP_API_URL, WP_USERNAME, WP_PASSWORD');
    process.exit(1);
  }

  let existingPosts;
  try {
    existingPosts = await getExistingEBikes(token);
    console.log(`📋 Found ${existingPosts.size} existing posts in WordPress`);
  } catch (error) {
    console.error('❌ Failed to fetch existing posts');
    process.exit(1);
  }

  let updated = 0;
  let created = 0;
  let errors = 0;

  for (let i = 0; i < ebikes.length; i++) {
    const ebike = ebikes[i];
    const title = `${ebike.brand} ${ebike.model_name}`.toLowerCase();
    const postId = existingPosts.get(title);

    try {
      if (postId) {
        await updateEBike(token, postId, ebike);
        console.log(`✅ [${i + 1}/${ebikes.length}] Updated: ${ebike.brand} ${ebike.model_name}`);
        updated++;
      } else {
        await createEBike(token, ebike);
        console.log(`✨ [${i + 1}/${ebikes.length}] Created: ${ebike.brand} ${ebike.model_name}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ [${i + 1}/${ebikes.length}] Failed: ${ebike.brand} ${ebike.model_name}`);
      errors++;
    }

    // Small delay to avoid overwhelming the server
    if (i < ebikes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log('\n🏁 Sync complete!');
  console.log(`✅ Updated: ${updated}`);
  console.log(`✨ Created: ${created}`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
  }
}

syncEBikes().catch(console.error);

