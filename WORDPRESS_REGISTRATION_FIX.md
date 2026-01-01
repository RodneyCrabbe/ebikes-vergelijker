# WordPress Registration Fix

## Problem
WordPress REST API `/wp/v2/users` endpoint requires authentication to create users. Public registration is blocked by default.

## Solution Options

### Option 1: Enable Public Registration (Recommended)
1. Go to WordPress Admin → Settings → General
2. Check **"Anyone can register"**
3. Set **"New User Default Role"** to `Subscriber`
4. Save changes

### Option 2: Create Custom Registration Endpoint
Add this code to your WordPress theme's `functions.php` or a custom plugin:

```php
// Add custom registration endpoint
add_action('rest_api_init', function () {
    register_rest_route('ebikes/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'ebikes_register_user',
        'permission_callback' => '__return_true', // Allow public access
    ));
});

function ebikes_register_user($request) {
    $username = sanitize_user($request['username']);
    $email = sanitize_email($request['email']);
    $password = $request['password'];
    $name = sanitize_text_field($request['name']);

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'Username, email, and password are required.', array('status' => 400));
    }

    // Check if user exists
    if (username_exists($username)) {
        return new WP_Error('username_exists', 'Username already exists.', array('status' => 400));
    }

    if (email_exists($email)) {
        return new WP_Error('email_exists', 'Email already registered.', array('status' => 400));
    }

    // Create user
    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    // Update user display name
    wp_update_user(array(
        'ID' => $user_id,
        'display_name' => $name
    ));

    // Return user data
    $user = get_userdata($user_id);
    return array(
        'id' => $user_id,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'name' => $user->display_name
    );
}
```

Then update `wordpress.ts` to use:
```typescript
const response = await fetch(`${WP_API_URL}/ebikes/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: data.email.split('@')[0],
        email: data.email,
        password: data.password,
        name: data.name
    })
})
```

### Option 3: Use Registration Plugin
Install a plugin like:
- **WP REST API - User Registration** 
- **User Registration** (by WPEverest)
- **Ultimate Member** (has REST API support)

## Current Status
The code has been updated to provide better error messages. Choose one of the options above to enable registration.


