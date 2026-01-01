<?php
/**
 * Plugin Name: E-Bikes Registration Endpoint
 * Description: Custom REST API endpoint for user registration
 * Version: 1.0.0
 * Author: E-Bikes Vergelijker
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Register custom registration endpoint
add_action('rest_api_init', function () {
    register_rest_route('ebikes/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'ebikes_register_user',
        'permission_callback' => '__return_true', // Allow public access
    ));
});

function ebikes_register_user($request) {
    $params = $request->get_json_params();
    
    $username = isset($params['username']) ? sanitize_user($params['username']) : '';
    $email = isset($params['email']) ? sanitize_email($params['email']) : '';
    $password = isset($params['password']) ? $params['password'] : '';
    $name = isset($params['name']) ? sanitize_text_field($params['name']) : '';

    // Validate required fields
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error(
            'missing_fields',
            'Username, email, and password are required.',
            array('status' => 400)
        );
    }

    // Validate email format
    if (!is_email($email)) {
        return new WP_Error(
            'invalid_email',
            'Invalid email address format.',
            array('status' => 400)
        );
    }

    // Check if username exists
    if (username_exists($username)) {
        return new WP_Error(
            'username_exists',
            'Username already exists. Please choose a different username.',
            array('status' => 400)
        );
    }

    // Check if email exists
    if (email_exists($email)) {
        return new WP_Error(
            'email_exists',
            'An account with this email already exists. Please log in instead.',
            array('status' => 400)
        );
    }

    // Validate password strength
    if (strlen($password) < 6) {
        return new WP_Error(
            'weak_password',
            'Password must be at least 6 characters long.',
            array('status' => 400)
        );
    }

    // Create user
    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    // Update user display name and other meta
    $update_data = array('ID' => $user_id);
    
    if (!empty($name)) {
        $update_data['display_name'] = $name;
        $update_data['first_name'] = $name;
    }
    
    wp_update_user($update_data);

    // Set user role (default is Subscriber)
    $user = new WP_User($user_id);
    $user->set_role('subscriber');

    // Return user data (similar to login response format)
    $user_data = get_userdata($user_id);
    
    return array(
        'success' => true,
        'user_id' => $user_id,
        'user_email' => $user_data->user_email,
        'user_display_name' => $user_data->display_name,
        'user_nicename' => $user_data->user_nicename,
        'message' => 'Registration successful. You can now log in.'
    );
}


