import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You'll need to set these in your .env file
const WP_API_URL = process.env.VITE_WP_API_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

async function getJwtToken() {
  if (!WP_API_URL || !WP_USERNAME || !WP_PASSWORD) {
    throw new Error('Missing WP credentials in environment variables');
  }

  try {
    console.log('Attempting to connect to:', `${WP_API_URL}/jwt-auth/v1/token`);
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

    const text = await response.text();
    console.log('Raw response from server:', text.substring(0, 200) + (text.length > 200 ? '...' : '')); // Log first 200 chars

    if (!response.ok) {
         console.error('Server returned error status:', response.status, response.statusText);
         throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    try {
        const data = JSON.parse(text);
        if (!data.token) {
            throw new Error('Failed to get JWT token: ' + JSON.stringify(data));
        }
        return data.token;
    } catch (e) {
        console.error('Failed to parse JSON response.');
        throw new Error('Invalid JSON response from server');
    }

  } catch (error) {
    console.error('Auth Error:', error);
    throw error;
  }
}

async function migrateEBikes() {
  console.log('🚀 Starting migration to WordPress...');
  
  // Read local JSON file
  const dataPath = path.join(__dirname, '../src/data/ebikes.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const ebikes = JSON.parse(rawData);

  console.log(`Found ${ebikes.length} e-bikes to migrate.`);

  let token;
  try {
    token = await getJwtToken();
    console.log('✅ Authenticated with WordPress');
  } catch (error) {
    console.error('❌ Authentication failed. Check your .env file and server logs.');
    return;
  }

  for (const ebike of ebikes) {
    console.log(`Processing: ${ebike.brand} ${ebike.model_name}`);

    // Map fields to WP structure
    // Note: You must have ACF fields created in WP with these keys
    const acfFields = {
        brand: ebike.brand,
        price: ebike.price,
        currency: ebike.currency,
        build_date: ebike.build_date,
        gender_type: ebike.gender_type,
        action_radius_km: ebike.action_radius_km,
        battery_capacity: ebike.battery_capacity,
        top_speed_kmh: ebike.top_speed_kmh,
        image_url: ebike.image_url,
        affiliate_url: ebike.affiliate_url,
        cpl_rate: ebike.cpl_rate,
        // Add other fields as necessary
        bike_type: ebike.bike_type,
        color: ebike.color,
        motor_location: ebike.motor_location,
        removable_battery: ebike.removable_battery ? 1 : 0, // ACF boolean often uses 1/0
        on_sale: ebike.on_sale ? 1 : 0
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
        console.error(`❌ Failed to create ${ebike.model_name}:`, text);
      } else {
        console.log(`✅ Created: ${ebike.model_name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${ebike.model_name}:`, error);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('🏁 Migration complete!');
}

migrateEBikes();
