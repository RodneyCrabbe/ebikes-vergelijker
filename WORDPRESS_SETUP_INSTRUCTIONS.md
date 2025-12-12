# WordPress Registration Setup Instructions

## Quick Fix: Enable Public Registration

The easiest solution is to enable public registration in WordPress:

1. **Log in to WordPress Admin** at `https://ebikesvergelijker.nl/wp-admin`
2. Go to **Settings → General**
3. Check the box **"Anyone can register"**
4. Set **"New User Default Role"** to `Subscriber`
5. Click **"Save Changes"**

This will allow the standard WordPress REST API endpoint to work for registration.

---

## Alternative: Install Custom Registration Plugin

If you prefer a custom endpoint (more control, better error messages):

### Step 1: Upload Plugin File

1. **Via WordPress Admin:**
   - Go to **Plugins → Add New → Upload Plugin**
   - Upload the file: `wordpress-plugins/ebikes-registration.php`
   - Click **"Install Now"** then **"Activate"**

2. **Via FTP/File Manager:**
   - Navigate to `wp-content/plugins/`
   - Create folder: `ebikes-registration`
   - Upload `ebikes-registration.php` into that folder
   - Go to WordPress Admin → Plugins → Activate "E-Bikes Registration Endpoint"

### Step 2: Test Registration

The custom endpoint will be available at:
```
POST https://ebikesvergelijker.nl/wp-json/ebikes/v1/register
```

The frontend code will automatically try this endpoint first, then fall back to the standard endpoint.

---

## Verify Setup

After enabling registration (either method), test it:

1. Go to your registration page: `https://ebikesvergelijker.nl/#/registreer`
2. Fill in the form
3. Submit registration
4. You should be automatically logged in after successful registration

---

## Troubleshooting

### Error: "Registration is currently disabled"
- **Solution:** Enable "Anyone can register" in WordPress Settings → General

### Error: "Username already exists"
- **Solution:** The username is already taken. The system generates usernames from email addresses.

### Error: "Email already registered"
- **Solution:** An account with this email already exists. Use the login page instead.

### Error: "Weak password"
- **Solution:** Password must be at least 6 characters long.

---

## Security Notes

- The custom registration endpoint validates all inputs
- Passwords are hashed by WordPress
- Users are created with "Subscriber" role by default
- Email validation is performed
- Duplicate username/email checks are in place

