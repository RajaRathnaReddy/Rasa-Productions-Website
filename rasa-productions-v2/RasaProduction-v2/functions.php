<?php
function rasa_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'rasa_theme_setup');

// 1. Intercept Next.js RSC payload requests (.txt files) early!
// Next.js Turbopack generates files like 'contact.txt' or '__next.contact.txt'
function rasa_handle_rsc_payloads() {
    $uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    
    // Look for any .txt file request that matches the internal theme structure
    if (preg_match('/\.txt$/', $uri)) {
        $relative_path = ltrim($uri, '/');
        
        // Strip out the assetPrefix if Next.js appended it to the fetch URL
        $prefix = 'wp-content/themes/RasaProduction-v2/';
        if (strpos($relative_path, $prefix) === 0) {
            $relative_path = substr($relative_path, strlen($prefix));
        }

        // CRITICAL FIX: Next.js client router uses DOTS as path separators in payload URLs
        // e.g. it requests: contact/__next.contact.__PAGE__.txt
        // but the exported file is at: contact/__next.contact/__PAGE__.txt
        // We need to try converting dots to slashes to find the correct file
        $dot_to_slash_path = preg_replace('/\.(__PAGE__)/', '/$1', $relative_path);
        
        $possible_paths = [
            get_template_directory() . '/' . $relative_path,
            get_template_directory() . '/' . $dot_to_slash_path,
            get_template_directory() . '/' . str_replace('.txt', '/index.txt', $relative_path),
            get_template_directory() . '/__next.' . $relative_path,
        ];

        foreach ($possible_paths as $theme_path) {
            if (file_exists($theme_path) && !is_dir($theme_path)) {
                header('Content-Type: text/plain; charset=utf-8');
                header('Cache-Control: public, max-age=0, must-revalidate');
                header('Access-Control-Allow-Origin: *'); // Allow Next.js router to fetch it
                readfile($theme_path);
                exit;
            }
        }
    }
}
// Run on parse_request so we completely bypass WP's routing engine for data files
add_action('parse_request', 'rasa_handle_rsc_payloads', 1);


// 2. Custom Page Router (Bypasses WP's strict canonical trailing slashes)
// This strictly maps domains like /contact or /contact/ straight to contact.php
function rasa_custom_router() {
    if (is_admin()) return;

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $route = trim($path, '/');
    
    // Strip out the assetPrefix if it accidentally leaked into the route URL
    $prefix = 'wp-content/themes/RasaProduction-v2/';
    if (strpos($route, $prefix) === 0) {
        $route = substr($route, strlen($prefix));
    }
    
    // List of Next.js exported pages
    $valid_routes = ['about', 'admin', 'contact', 'data-deletion', 'music', 'privacy', 'terms', 'videos', 'virtual-production'];
    
    if (in_array($route, $valid_routes)) {
        // We found a match! Serve the PHP template directly
        global $wp_query;
        $wp_query->is_404 = false;
        status_header(200);
        
        $template_file = get_template_directory() . '/' . $route . '.php';
        if (file_exists($template_file)) {
            include($template_file);
            exit;
        }
    }
}
add_action('template_redirect', 'rasa_custom_router', 1);

// Prevent canonical redirects that force trailing slashes on our custom routes
add_filter('redirect_canonical', function($redirect_url, $requested_url) {
    $path = trim(parse_url($requested_url, PHP_URL_PATH), '/');
    $valid_routes = ['about', 'admin', 'contact', 'data-deletion', 'music', 'privacy', 'terms', 'videos', 'virtual-production'];
    
    // Strip prefix for redirect check too
    $prefix = 'wp-content/themes/RasaProduction-v2/';
    if (strpos($path, $prefix) === 0) {
        $path = substr($path, strlen($prefix));
    }

    if (in_array($path, $valid_routes)) {
        return false;
    }
    return $redirect_url;
}, 10, 2);

// 3. Custom REST API Endpoint for Contact Form
add_action('rest_api_init', function () {
    register_rest_route('rasa/v1', '/contact', array(
        'methods' => 'POST',
        'callback' => 'rasa_handle_contact_form',
        'permission_callback' => '__return_true'
    ));
});

function rasa_handle_contact_form($request) {
    $params = $request->get_json_params();
    $name = sanitize_text_field($params['name']);
    $email = sanitize_email($params['email']);
    $phone = sanitize_text_field($params['phone']);
    $message = sanitize_textarea_field($params['message']);

    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('missing_fields', 'Missing required fields', array('status' => 400));
    }

    $to = 'rasaproductionsindia@gmail.com';
    $subject = 'New Enquiry from ' . $name;
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';

    $sent = wp_mail($to, $subject, $body, $headers);

    if ($sent) {
        return rest_ensure_response(array('success' => true));
    } else {
        return new WP_Error('email_failed', 'Failed to send email. Please try again later.', array('status' => 500));
    }
}
