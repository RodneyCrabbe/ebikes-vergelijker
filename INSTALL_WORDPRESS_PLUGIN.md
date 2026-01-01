# Install WordPress Registration Plugin - STEP BY STEP

## Problem
Registration returns 405 errors because:
1. WordPress "Anyone can register" is NOT enabled
2. Custom registration plugin is NOT installed

## Solution: Install Custom Registration Plugin

This plugin allows registration WITHOUT enabling "Anyone can register" in WordPress settings.

### Step 1: Access WordPress Admin
1. Go to: `https://ebikesvergelijker.nl/wp-admin`
2. Log in with your admin credentials

### Step 2: Upload Plugin
1. In WordPress Admin, go to: **Plugins → Add New**
2. Click: **"Upload Plugin"** button (top of page)
3. Click: **"Choose File"** or **"Browse"**
4. Navigate to: `C:\Users\lenovo\Desktop\E-bikes Vergelijker\ebike-platform\wordpress-plugins\`
5. Select: **`ebikes-registration.php`**
6. Click: **"Install Now"**

### Step 3: Activate Plugin
1. After installation, click: **"Activate Plugin"**
2. You should see: "Plugin activated successfully"

### Step 4: Test Registration
1. Go to: `https://ebikesvergelijker.nl/#/registreer`
2. Fill in the registration form
3. Submit - it should work now!

## Alternative: Enable "Anyone can register" (Easier but less secure)

If you prefer not to install the plugin:

1. Go to: **Settings → General**
2. Check: **"Anyone can register"**
3. Set: **"New User Default Role"** to `Subscriber`
4. Click: **"Save Changes"**

## Verify Plugin is Active

After installing, you can test the endpoint:
```powershell
$body = @{ username = "testuser"; email = "test@test.com"; password = "test123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://ebikesvergelijker.nl/wp-json/ebikes/v1/register" -ContentType "application/json" -Body $body
```

If it works, you'll get a success response. If you get 404, the plugin isn't installed/activated.


