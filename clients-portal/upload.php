<?php
/**
 * Rasa Productions Studio - Secure File Uploader
 * 
 * INSTRUCTIONS:
 * 1. Upload this exact `upload.php` file to your cPanel `public_html` folder.
 * 2. It will automatically create a `storage` folder to hold your files.
 * 3. Make sure to update the `API_KEY` below if you want stricter security.
 */

// Basic Security (Must match NEXT_PUBLIC_UPLOAD_API_KEY in Vercel .env)
define('API_KEY', 'RASA_STUDIO_UPLOAD_2026_xYz987');

// Configuration
$uploadDir = __DIR__ . '/storage/';
$publicBaseUrl = 'https://' . $_SERVER['HTTP_HOST'] . '/storage/';

// Allow cross-origin requests from your Vercel frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
header('Content-Type: application/json');

// Handle Preflight OPTIONS request (Browser safety check)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Check API Key Security
$providedKey = isset($_SERVER['HTTP_X_API_KEY']) ? $_SERVER['HTTP_X_API_KEY'] : '';
if ($providedKey !== API_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized. Invalid API Key.']);
    exit();
}

// 2. Ensure it is a POST request with a file
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or invalid method.']);
    exit();
}

$file = $_FILES['file'];
// Safety check on file upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Upload failed with error code: ' . $file['error']]);
    exit();
}

// 3. Determine the save path from the POST body (e.g., '123-uuid/song.wav')
$targetPathFragment = isset($_POST['path']) ? $_POST['path'] : time() . '-' . basename($file['name']);

// Prevent directory traversal attacks (e.g., ../../etc/passwd)
$targetPathFragment = str_replace(['..', "\0"], '', $targetPathFragment);
$targetPathFragment = ltrim($targetPathFragment, '/');

$fullSavePath = $uploadDir . $targetPathFragment;

// 4. Create directories if they don't exist (e.g., /storage/123-uuid/)
$dirStructure = dirname($fullSavePath);
if (!is_dir($dirStructure)) {
    if (!mkdir($dirStructure, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create storage directories.']);
        exit();
    }
}

// 5. Move the uploaded file to the final destination
if (move_uploaded_file($file['tmp_name'], $fullSavePath)) {
    // Successfully saved! Return the public URL to Next.js
    $publicUrl = $publicBaseUrl . str_replace('\\', '/', $targetPathFragment);
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Upload successful',
        'url' => $publicUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file to final destination.']);
}
