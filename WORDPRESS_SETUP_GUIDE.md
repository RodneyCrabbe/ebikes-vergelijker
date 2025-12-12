# WordPress Authentication Setup Guide

This guide will help you configure WordPress on Siteground to work with your E-bikes Vergelijker frontend application.

## Overview

Your frontend is already configured to use WordPress for:
- User Registration
- User Login/Logout
- E-bike data storage
- User session management with JWT tokens

## Prerequisites

- WordPress installed on Siteground
- Admin access to WordPress dashboard
- FTP/File Manager access (for configuration files)

---

## Step 1: Install Required WordPress Plugins

Log in to your WordPress admin dashboard and install these plugins:

### 1.1 JWT Authentication for WP-REST-API

**Plugin Name:** JWT Authentication for WP-REST-API  
**Author:** Useful Team  
**Link:** https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/

**Installation:**
1. Go to `Plugins` → `Add New`
2. Search for "JWT Authentication for WP-REST-API"
3. Click `Install Now`
4. Click `Activate`

### 1.2 Custom Post Type UI (CPT UI)

**Plugin Name:** Custom Post Type UI  
**Author:** WebDevStudios  
**Link:** https://wordpress.org/plugins/custom-post-type-ui/

**Installation:**
1. Go to `Plugins` → `Add New`
2. Search for "Custom Post Type UI"
3. Click `Install Now`
4. Click `Activate`

### 1.3 Advanced Custom Fields (ACF)

**Plugin Name:** Advanced Custom Fields  
**Author:** WP Engine  
**Link:** https://wordpress.org/plugins/advanced-custom-fields/

**Installation:**
1. Go to `Plugins` → `Add New`
2. Search for "Advanced Custom Fields"
3. Click `Install Now`
4. Click `Activate`

---

## Step 2: Configure JWT Authentication

### 2.1 Edit wp-config.php

You need to add a secret key to your `wp-config.php` file. Access this via:
- **Siteground File Manager:** Site Tools → File Manager → `public_html/wp-config.php`
- **FTP Client:** Connect and navigate to your WordPress root directory

**Add these lines BEFORE the line that says `/* That's all, stop editing! */`:**

```php
// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-key-here-change-this-to-something-random');
define('JWT_AUTH_CORS_ENABLE', true);
```

**Important:** Replace `'your-super-secret-key-here-change-this-to-something-random'` with a strong, random string. You can generate one at: https://api.wordpress.org/secret-key/1.1/salt/

**Example:**
```php
define('JWT_AUTH_SECRET_KEY', 'aK8#mP9$xL2@qR5&vN7*wT3!yU6^zB4%cD1+eF0-gH8~iJ2');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 2.2 Edit .htaccess (Apache servers)

If your Siteground uses Apache (most do), you need to enable HTTP Authorization headers.

**Access:** Site Tools → File Manager → `public_html/.htaccess`

**Add these lines at the TOP of the file:**

```apache
# BEGIN JWT Authentication
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
# END JWT Authentication
```

**Save the file.**

### 2.3 Enable User Registration

1. Go to `Settings` → `General`
2. Check the box for **"Anyone can register"**
3. Set **"New User Default Role"** to `Subscriber`
4. Click `Save Changes`

---

## Step 3: Create E-bike Custom Post Type

### 3.1 Using Custom Post Type UI Plugin

1. Go to `CPT UI` → `Add/Edit Post Types`
2. Fill in the following:

**Basic Settings:**
- **Post Type Slug:** `ebike` (IMPORTANT: must be exactly this)
- **Plural Label:** `E-bikes`
- **Singular Label:** `E-bike`

**Additional Labels (optional but recommended):**
- **Menu Name:** `E-bikes`
- **All Items:** `All E-bikes`
- **Add New:** `Add New E-bike`
- **Add New Item:** `Add New E-bike`
- **Edit Item:** `Edit E-bike`
- **View Item:** `View E-bike`
- **Search Items:** `Search E-bikes`

**Settings:**
- **Public:** `True`
- **Show in REST API:** `True` (CRITICAL - must be enabled)
- **REST API base slug:** `ebike`
- **Has Archive:** `True`
- **Hierarchical:** `False`
- **Supports:** Check `Title`, `Editor`, `Thumbnail`

3. Click `Add Post Type`

---

## Step 4: Create ACF Field Group for E-bikes

### 4.1 Create New Field Group

1. Go to `Custom Fields` → `Add New`
2. **Title:** `E-bike Details`

### 4.2 Add Fields

Click `+ Add Field` for each field below:

#### Basic Information

**Field 1: Brand**
- Field Label: `Brand`
- Field Name: `brand`
- Field Type: `Text`
- Required: `Yes`

**Field 2: Price**
- Field Label: `Price`
- Field Name: `price`
- Field Type: `Number`
- Required: `Yes`

**Field 3: Currency**
- Field Label: `Currency`
- Field Name: `currency`
- Field Type: `Text`
- Default Value: `EUR`

**Field 4: Build Date**
- Field Label: `Build Date`
- Field Name: `build_date`
- Field Type: `Date Picker`
- Display Format: `Y-m-d`
- Return Format: `Y-m-d`

**Field 5: Gender Type**
- Field Label: `Gender Type`
- Field Name: `gender_type`
- Field Type: `Select`
- Choices:
  ```
  unisex : Unisex
  man : Man
  vrouw : Vrouw
  ```
- Default Value: `unisex`

#### Performance Specifications

**Field 6: Action Radius (km)**
- Field Label: `Action Radius (km)`
- Field Name: `action_radius_km`
- Field Type: `Number`

**Field 7: Battery Capacity (Wh)**
- Field Label: `Battery Capacity (Wh)`
- Field Name: `battery_capacity`
- Field Type: `Number`

**Field 8: Top Speed (km/h)**
- Field Label: `Top Speed (km/h)`
- Field Name: `top_speed_kmh`
- Field Type: `Number`

#### Images and Links

**Field 9: Image URL**
- Field Label: `Image URL`
- Field Name: `image_url`
- Field Type: `URL`
- Instructions: `External image URL (optional if using Featured Image)`

**Field 10: Affiliate URL**
- Field Label: `Affiliate URL`
- Field Name: `affiliate_url`
- Field Type: `URL`

**Field 11: CPL Rate**
- Field Label: `CPL Rate`
- Field Name: `cpl_rate`
- Field Type: `Number`
- Instructions: `Cost per lead/click rate`

#### Bike Specifications

**Field 12: Bike Type**
- Field Label: `Bike Type`
- Field Name: `bike_type`
- Field Type: `Select`
- Choices:
  ```
  stadsfiets : Stadsfiets
  transport : Transport
  vouwfiets : Vouwfiets
  mountainbike : Mountainbike
  trekking : Trekking
  premium : Premium
  bakfiets : Bakfiets
  ```
- Allow Null: `Yes`

**Field 13: Color**
- Field Label: `Color`
- Field Name: `color`
- Field Type: `Text`

**Field 14: Motor Location**
- Field Label: `Motor Location`
- Field Name: `motor_location`
- Field Type: `Select`
- Choices:
  ```
  midden : Midden
  achterwiel : Achterwiel
  voorwiel : Voorwiel
  ```
- Allow Null: `Yes`

**Field 15: Removable Battery**
- Field Label: `Removable Battery`
- Field Name: `removable_battery`
- Field Type: `True / False`
- Default Value: `0`

**Field 16: On Sale**
- Field Label: `On Sale`
- Field Name: `on_sale`
- Field Type: `True / False`
- Default Value: `0`

### 4.3 Set Location Rules

Scroll down to **Location** section:
- **Show this field group if:**
  - Post Type `is equal to` `ebike`

### 4.4 Save Field Group

Click `Publish` or `Update`

---

## Step 5: Configure CORS (Cross-Origin Resource Sharing)

Since your frontend (Vercel) and backend (Siteground) are on different domains, you need to enable CORS.

### 5.1 Add CORS Headers to WordPress

Create or edit the file `wp-content/mu-plugins/cors.php`:

**Access via:** File Manager → `public_html/wp-content/mu-plugins/` (create `mu-plugins` folder if it doesn't exist)

**File: cors.php**

```php
<?php
/**
 * Plugin Name: CORS Configuration
 * Description: Enable CORS for REST API
 */

add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }
        
        return $value;
    });
}, 15);
```

**Important:** For production, replace `*` with your actual Vercel domain:
```php
header('Access-Control-Allow-Origin: https://ebikesvergelijker.nl');
```

---

## Step 6: Update Your .env File

In your local project, create or update the `.env` file:

**File: ebike-platform/.env**

```env
# WordPress API Configuration
VITE_WP_API_URL=https://your-siteground-domain.com/wp-json

# For migration script only (DO NOT commit these to Git)
WP_USERNAME=your_wordpress_admin_username
WP_PASSWORD=your_wordpress_admin_password
```

**Replace:**
- `your-siteground-domain.com` with your actual WordPress domain
- `your_wordpress_admin_username` with your WordPress admin username
- `your_wordpress_admin_password` with your WordPress admin password

**Important:** Add `.env` to your `.gitignore` file to prevent committing credentials!

---

## Step 7: Configure Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project: `ebikes-vergelijker`
3. Go to `Settings` → `Environment Variables`
4. Add the following variable:

**Variable:**
- **Key:** `VITE_WP_API_URL`
- **Value:** `https://your-siteground-domain.com/wp-json`
- **Environment:** Check all (Production, Preview, Development)

5. Click `Save`
6. **Redeploy** your application for changes to take effect

---

## Step 8: Test the WordPress API Endpoints

### 8.1 Test JWT Token Endpoint

Open your browser or use a tool like Postman:

**Endpoint:** `https://your-siteground-domain.com/wp-json/jwt-auth/v1/token`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "your_admin_username",
  "password": "your_admin_password"
}
```

**Expected Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_email": "admin@example.com",
  "user_nicename": "admin",
  "user_display_name": "Admin"
}
```

### 8.2 Test User Registration Endpoint

**Endpoint:** `https://your-siteground-domain.com/wp-json/wp/v2/users`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

**Expected Response:**
```json
{
  "id": 2,
  "username": "testuser",
  "name": "Test User",
  "email": "testuser@example.com",
  ...
}
```

### 8.3 Test E-bikes Endpoint

**Endpoint:** `https://your-siteground-domain.com/wp-json/wp/v2/ebike`

**Method:** GET

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": {
      "rendered": "Brand Model Name"
    },
    "acf": {
      "brand": "Brand",
      "price": 1999,
      "battery_capacity": 500,
      ...
    }
  }
]
```

---

## Step 9: Migrate Existing E-bike Data (Optional)

If you have existing e-bike data in your local JSON file, you can migrate it to WordPress.

### 9.1 Run Migration Script

```bash
cd ebike-platform
node scripts/migrate-to-wordpress.js
```

**Note:** Make sure your `.env` file has the correct credentials before running this script.

---

## Step 10: Test Frontend Authentication

1. **Deploy your changes to Vercel** (if you made any code changes)
2. Visit your live site: `https://ebikesvergelijker.nl`
3. Click on **"Registreer"** (Register)
4. Fill in the registration form
5. Submit the form
6. Check if you're redirected and logged in
7. Try logging out and logging back in

---

## Troubleshooting

### Issue: "JWT token is invalid"

**Solution:**
- Check that `JWT_AUTH_SECRET_KEY` is defined in `wp-config.php`
- Verify `.htaccess` has the Authorization header rules
- Clear browser cache and try again

### Issue: "Registration failed: rest_cannot_create_user"

**Solution:**
- Go to `Settings` → `General` and enable "Anyone can register"
- Check that the REST API is accessible: visit `https://your-domain.com/wp-json/`

### Issue: "CORS policy error"

**Solution:**
- Verify the `cors.php` file is in `wp-content/mu-plugins/`
- Check that the file has correct PHP syntax
- Restart your web server (contact Siteground support if needed)

### Issue: "Cannot read property 'token' of undefined"

**Solution:**
- Check the API URL in your `.env` file
- Verify the JWT plugin is activated
- Test the endpoint manually using Postman

### Issue: E-bikes not loading

**Solution:**
- Verify the `ebike` custom post type is created
- Check that "Show in REST API" is enabled for the post type
- Ensure at least one e-bike post is published
- Test the endpoint: `https://your-domain.com/wp-json/wp/v2/ebike`

---

## Security Best Practices

1. **Use Strong Passwords:** Ensure all WordPress users have strong passwords
2. **Limit CORS Origins:** In production, replace `*` with your specific domain
3. **Keep Plugins Updated:** Regularly update all WordPress plugins
4. **Use HTTPS:** Ensure your Siteground site uses SSL/HTTPS
5. **Protect wp-config.php:** Ensure proper file permissions (644 or 640)
6. **Don't Commit Credentials:** Never commit `.env` files to Git

---

## Next Steps

After completing this setup:

1. ✅ Test user registration on your live site
2. ✅ Test user login/logout functionality
3. ✅ Create a few test e-bike posts in WordPress
4. ✅ Verify e-bikes appear on your frontend
5. ✅ Test the dealer portal for submitting new e-bikes
6. ✅ Configure email notifications (optional)
7. ✅ Set up backup system for WordPress (Siteground provides this)

---

## Support

If you encounter issues:

1. Check WordPress debug log: Enable `WP_DEBUG` in `wp-config.php`
2. Check browser console for JavaScript errors
3. Test API endpoints with Postman or similar tool
4. Contact Siteground support for server-related issues
5. Review WordPress REST API documentation: https://developer.wordpress.org/rest-api/

---

## Summary Checklist

- [ ] Install JWT Authentication plugin
- [ ] Install Custom Post Type UI plugin
- [ ] Install Advanced Custom Fields plugin
- [ ] Configure JWT in wp-config.php
- [ ] Update .htaccess for Authorization headers
- [ ] Enable user registration in WordPress
- [ ] Create 'ebike' custom post type
- [ ] Create ACF field group with all e-bike fields
- [ ] Configure CORS (cors.php in mu-plugins)
- [ ] Update .env file with WordPress API URL
- [ ] Add VITE_WP_API_URL to Vercel environment variables
- [ ] Test JWT token endpoint
- [ ] Test user registration endpoint
- [ ] Test e-bikes endpoint
- [ ] Test frontend registration
- [ ] Test frontend login/logout
- [ ] Migrate existing e-bike data (optional)

---

**Your authentication system is now ready to use!** 🎉

