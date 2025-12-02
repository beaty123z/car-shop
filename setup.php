<?php
// Setup script to initialize database on Render
// Access: https://your-site.onrender.com/setup.php

require_once 'php/config.php';

echo "<!DOCTYPE html>";
echo "<html>";
echo "<head>";
echo "<title>CarShop Setup</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }";
echo ".container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo ".success { color: #10b981; font-weight: bold; }";
echo ".error { color: #ef4444; font-weight: bold; }";
echo ".info { color: #2563eb; }";
echo ".step { margin: 15px 0; padding: 10px; border-left: 4px solid #2563eb; background: #f0f9ff; }";
echo ".code { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; overflow-x: auto; margin: 10px 0; }";
echo "hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<h1>🚗 CarShop Database Setup</h1>";

// Check database connection
echo "<div class='step'>";
echo "<h3>Step 1: Testing Database Connection</h3>";

try {
    // Test connection
    $test_query = $conn->query("SELECT 1");
    if ($test_query) {
        echo "<p class='success'>✓ Database connection successful!</p>";
        echo "<p class='info'>Host: " . DB_HOST . "</p>";
        echo "<p class='info'>Database: " . DB_NAME . "</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Database connection failed!</p>";
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
    echo "<p>Please check your environment variables:</p>";
    echo "<div class='code'>";
    echo "DB_HOST=" . DB_HOST . "<br>";
    echo "DB_USER=" . DB_USER . "<br>";
    echo "DB_NAME=" . DB_NAME . "<br>";
    echo "</div>";
    echo "</div>";
    echo "</body></html>";
    exit;
}

echo "</div>";

// Run setup SQL
echo "<div class='step'>";
echo "<h3>Step 2: Creating Database Tables</h3>";

$sql_file = __DIR__ . '/database.sql';

if (!file_exists($sql_file)) {
    echo "<p class='error'>✗ database.sql file not found!</p>";
    echo "</div></body></html>";
    exit;
}

$sql = file_get_contents($sql_file);

// Remove USE statement and handle it manually
$sql = preg_replace('/^USE\s+[\w`]+;/mi', '', $sql);

// Split queries
$queries = array_filter(array_map('trim', explode(';', $sql)));

$success_count = 0;
$error_count = 0;

foreach ($queries as $query) {
    if (empty($query)) continue;
    
    try {
        $conn->query($query);
        $success_count++;
        
        // Show what was created
        if (preg_match('/CREATE TABLE IF NOT EXISTS\s+(\w+)/i', $query, $matches)) {
            echo "<p class='success'>✓ Created table: " . $matches[1] . "</p>";
        } elseif (preg_match('/INSERT INTO\s+(\w+)/i', $query, $matches)) {
            if (preg_match('/VALUES\s*\((.*?)\)/i', $query)) {
                echo "<p class='success'>✓ Inserted data into: " . $matches[1] . "</p>";
            }
        }
    } catch (Exception $e) {
        $error_count++;
        echo "<p class='error'>✗ Error: " . $e->getMessage() . "</p>";
    }
}

echo "</div>";

// Summary
echo "<div class='step'>";
echo "<h3>Setup Summary</h3>";

if ($error_count === 0) {
    echo "<p class='success'>✓ Database setup completed successfully!</p>";
    echo "<p class='info'>Executed queries: " . $success_count . "</p>";
    
    echo "<hr>";
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Go to: <a href='index.html'>Home Page</a></li>";
    echo "<li>Register a new account at: <a href='register.html'>Register</a></li>";
    echo "<li>Browse products at: <a href='shop.html'>Shop</a></li>";
    echo "</ol>";
    
    echo "<hr>";
    echo "<h3>Default Products Loaded:</h3>";
    echo "<p>The following product categories are available:</p>";
    echo "<ul>";
    echo "<li>🚗 Engine Parts</li>";
    echo "<li>⚙️ Transmission</li>";
    echo "<li>🛑 Brakes</li>";
    echo "<li>🔧 Suspension</li>";
    echo "<li>🔋 Electrical</li>";
    echo "<li>❄️ Cooling</li>";
    echo "<li>⚡ Engine Parts (Performance)</li>";
    echo "<li>🌊 Filters</li>";
    echo "<li>⛽ Fuel System</li>";
    echo "</ul>";
} else {
    echo "<p class='error'>✗ Setup completed with errors!</p>";
    echo "<p class='error'>Errors: " . $error_count . "</p>";
    echo "<p class='error'>Successful queries: " . $success_count . "</p>";
    echo "<p>Please check your database credentials and try again.</p>";
}

echo "</div>";

// Check tables exist
echo "<div class='step'>";
echo "<h3>Database Tables:</h3>";

try {
    $tables_query = $conn->query("SHOW TABLES");
    $tables = [];
    
    while ($row = $tables_query->fetch_row()) {
        $tables[] = $row[0];
    }
    
    if (!empty($tables)) {
        echo "<p class='success'>✓ Found " . count($tables) . " tables:</p>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li><code>" . $table . "</code></li>";
        }
        echo "</ul>";
    } else {
        echo "<p class='error'>✗ No tables found in database!</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>Error checking tables: " . $e->getMessage() . "</p>";
}

echo "</div>";

// Environment info
echo "<div class='step'>";
echo "<h3>Server Information:</h3>";
echo "<p class='info'>PHP Version: " . phpversion() . "</p>";
echo "<p class='info'>OS: " . php_uname() . "</p>";
echo "<p class='info'>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?>
