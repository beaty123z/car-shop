#!/bin/bash
set -e

echo "=== CarShop Deployment Script ==="

# Create necessary directories
mkdir -p /var/www/html/logs
mkdir -p /var/www/html/sessions

# Set proper permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
chmod -R 775 /var/www/html/logs
chmod -R 775 /var/www/html/sessions

# Enable Apache modules
a2enmod rewrite
a2enmod headers
a2enmod ssl

# Create .htaccess if needed
cat > /var/www/html/.htaccess <<EOF
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>

<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
EOF

echo "=== Deployment Complete ==="
