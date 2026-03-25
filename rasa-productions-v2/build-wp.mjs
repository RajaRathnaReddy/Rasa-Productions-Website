import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, 'out');
const THEME_DIR = path.join(__dirname, 'RasaProduction-v2');

// 1. Setup Theme Directory
if (fs.existsSync(THEME_DIR)) {
    fs.rmSync(THEME_DIR, { recursive: true, force: true });
}
fs.cpSync(OUT_DIR, THEME_DIR, { recursive: true });

// 2. Generate Core WP Files
const styleCss = `/*
Theme Name: Rasa Productions V2
Description: Custom WordPress theme generated from Next.js V02 codebase.
Author: Antigravity
Version: 1.0.0
*/`;
fs.writeFileSync(path.join(THEME_DIR, 'style.css'), styleCss);

// Get dynamic routes from the out directory
const htmlFiles = fs.readdirSync(OUT_DIR).filter(file => file.endsWith('.html') && file !== 'index.html' && file !== '404.html' && !file.startsWith('_'));
const routeNames = htmlFiles.map(file => file.replace('.html', ''));

// Map active routes for our manual template redirector
const routeNamesArray = routeNames.map(r => `'${r}'`).join(', ');

const functionsPhp = `<?php
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
    if (preg_match('/\\.txt$/', $uri)) {
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
        $dot_to_slash_path = preg_replace('/\\.(__PAGE__)/', '/$1', $relative_path);
        
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
    $valid_routes = [${routeNamesArray}];
    
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
    $valid_routes = [${routeNamesArray}];
    
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
    $body = "Name: $name\\nEmail: $email\\nPhone: $phone\\n\\nMessage:\\n$message";
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';

    $sent = wp_mail($to, $subject, $body, $headers);

    if ($sent) {
        return rest_ensure_response(array('success' => true));
    } else {
        return new WP_Error('email_failed', 'Failed to send email. Please try again later.', array('status' => 500));
    }
}
`;
fs.writeFileSync(path.join(THEME_DIR, 'functions.php'), functionsPhp);

const indexPhp = `<?php
// Fallback index.php required by WordPress
get_header(); ?>
<main>
    <h1>Welcome to Rasa Productions</h1>
</main>
<?php get_footer();
`;
fs.writeFileSync(path.join(THEME_DIR, 'index.php'), indexPhp);

// 3. Generate .htaccess for static asset caching
const htaccess = `# Cache Control for static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType audio/mpeg "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\\.(woff2|webp|svg|ico|mp3)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\\.(css|js)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
`;
fs.writeFileSync(path.join(THEME_DIR, '.htaccess'), htaccess);

// 4. Convert HTML to PHP Templates
function processHtmlFiles(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processHtmlFiles(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Inject WordPress functions ONLY if needed by plugins, but currently it breaks Next.js routing!
            // content = content.replace('</head>', '<?php wp_head(); ?>\\n</head>');
            // content = content.replace('</body>', '<?php wp_footer(); ?>\\n</body>');

            // Rewrite absolute paths for images, audio, logos, covers, and music
            content = content.replace(/(src|href)="\/(logos|audio|images|videos|covers|music)\//g, '$1="<?php echo get_template_directory_uri(); ?>/$2/');

            // Determine Template Name
            let newFileName = file.replace('.html', '.php');
            if (newFileName === 'index.php' && directory === THEME_DIR) {
                newFileName = 'front-page.php';
            } else if (newFileName !== '404.php' && newFileName !== 'front-page.php') {
                content = `<?php /* Template Name: ${file.replace('.html', '').toUpperCase()} Page */ ?>\\n` + content;
            }

            fs.writeFileSync(path.join(directory, newFileName), content);
            fs.unlinkSync(fullPath); // remove original .html
        }
    });
}

processHtmlFiles(THEME_DIR);

// 5. Rewrite asset paths inside JS bundles
// React hydration data and component code contain hardcoded paths like "/covers/...", "/audio/...", etc.
// These need the WP theme directory prefix to work on WordPress.
const WP_THEME_PATH = '/wp-content/themes/RasaProduction-v2';
const jsDir = path.join(THEME_DIR, '_next', 'static', 'chunks');

function rewriteJsAssetPaths(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            rewriteJsAssetPaths(fullPath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Rewrite paths like "/covers/...", "/audio/...", "/logos/...", "/music/..."
            const assetPathRegex = /"(\/(covers|audio|logos|music)\/[^"]+)"/g;
            if (assetPathRegex.test(content)) {
                content = content.replace(/"(\/(covers|audio|logos|music)\/[^"]+)"/g, `"${WP_THEME_PATH}$1"`);
                modified = true;
            }

            // Also rewrite paths in inline script data within HTML (self.__next_f patterns)
            const inlineRegex = /\\\\?"(\/(covers|audio|logos|music)\/[^"\\\\]+)\\\\?"/g;
            if (inlineRegex.test(content)) {
                content = content.replace(/\\\\?"(\/(covers|audio|logos|music)\/[^"\\\\]+)\\\\?"/g, (match, p1) => {
                    return match.replace(p1, `${WP_THEME_PATH}${p1} `);
                });
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`  Rewrote asset paths in: ${file} `);
            }
        }
    });
}

rewriteJsAssetPaths(jsDir);

// Also rewrite inline JS in PHP files (self.__next_f data contains asset paths)
function rewritePhpInlineAssets(directory) {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            rewritePhpInlineAssets(fullPath);
        } else if (file.endsWith('.php')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Rewrite JS-embedded paths in <script> tags within PHP files
            const regex = /"(\/(covers|audio|logos|music)\/[^"]+)"/g;
            if (regex.test(content)) {
                content = content.replace(/"(\/(covers|audio|logos|music)\/[^"]+)"/g, (match, p1, p2) => {
                    // Don't double-rewrite paths already containing WP_THEME_PATH or get_template_directory_uri
                    if (match.includes(WP_THEME_PATH) || match.includes('get_template_directory_uri')) return match;
                    return match.replace(p1, `${WP_THEME_PATH}${p1} `);
                });
                fs.writeFileSync(fullPath, content);
                console.log(`  Rewrote inline asset paths in: ${file} `);
            }

            // Also handle escaped paths in inline scripts (\\"/covers/...")
            const escapedRegex = /\\\\"(\/(covers|audio|logos|music)\/[^"\\\\]+)\\\\"/g;
            if (escapedRegex.test(content)) {
                content = fs.readFileSync(fullPath, 'utf8'); // re-read in case we wrote above
                content = content.replace(/\\\\"(\/(covers|audio|logos|music)\/[^"\\\\]+)\\\\"/g, (match, p1) => {
                    if (match.includes(WP_THEME_PATH)) return match;
                    return match.replace(p1, `${WP_THEME_PATH}${p1} `);
                });
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}

rewritePhpInlineAssets(THEME_DIR);

console.log('✅ WordPress Theme generated successfully in: ' + THEME_DIR);

