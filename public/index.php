<?php
// public/index.php - Router for all requests
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = dirname(__DIR__);

// Remove /public from the path if present
if (strpos($request, '/public') === 0) {
    $request = substr($request, 7);
}

// If empty, default to index.html
if (empty($request) || $request === '/') {
    $request = '/index.html';
}

// Check if it's a PHP file in the php directory
if (strpos($request, '/php/') === 0) {
    $phpFile = $root . $request;
    if (file_exists($phpFile)) {
        include $phpFile;
        exit;
    }
}

// Otherwise serve the file from root
$file = $root . $request;

// If it's a file, serve it
if (file_exists($file) && is_file($file)) {
    // Set correct content type
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
    ];
    
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    
    readfile($file);
    exit;
}

// If directory requested, try index.html
if (is_dir($file) && file_exists($file . '/index.html')) {
    header('Content-Type: text/html');
    readfile($file . '/index.html');
    exit;
}

// 404
http_response_code(404);
echo "404 - File not found";
?>
