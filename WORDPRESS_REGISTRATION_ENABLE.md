# Enable WordPress Registration - REQUIRED

## Critical: Registration Will Not Work Until This Is Done

Your registration is failing because WordPress requires "Anyone can register" to be enabled for the REST API `/wp/v2/users` endpoint to work.

## Quick Fix (2 minutes)

1. **Go to WordPress Admin:**
   - Visit: `https://ebikesvergelijker.nl/wp-admin`
   - Log in with your admin credentials

2. **Enable Registration:**
   - Go to: **Settings → General**
   - Check the box: **"Anyone can register"**
   - Set **"New User Default Role"** to: `Subscriber`
   - Click **"Save Changes"**

3. **Test Registration:**
   - Go to: `https://ebikesvergelijker.nl/#/registreer`
   - Try registering a new account
   - It should work now!

## Why This Is Needed

WordPress REST API `/wp/v2/users` endpoint requires authentication to create users UNLESS "Anyone can register" is enabled. This is a WordPress security feature.

## Alternative: Custom Registration Plugin

If you don't want to enable public registration, you can install the custom plugin:
- File: `wordpress-plugins/ebikes-registration.php`
- Upload to WordPress → Plugins → Add New → Upload Plugin
- Activate the plugin

This creates a custom endpoint that doesn't require "Anyone can register" to be enabled.

## Current Status

✅ Code is fixed and deployed
✅ Environment variable `VITE_WP_API_URL` is set in Vercel
✅ Domain is correctly pointing to Vercel
⏳ **Waiting for WordPress registration to be enabled**


