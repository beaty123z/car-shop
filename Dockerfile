FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    curl \
    git \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers ssl

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY --chown=www-data:www-data . .

# Copy deploy script
COPY deploy.sh /usr/local/bin/deploy.sh
RUN chmod +x /usr/local/bin/deploy.sh

# Create Apache configuration
RUN cat > /etc/apache2/sites-available/000-default.conf <<'EOF'
<VirtualHost *:8000>
    ServerName localhost
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
        
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule ^(.*)$ index.php [QSA,L]
        </IfModule>
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Configure Apache to listen on the PORT environment variable
RUN sed -i 's/Listen 80/Listen 0.0.0.0:8000/g' /etc/apache2/ports.conf

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Disable default site and enable ours
RUN a2dissite 000-default.conf 2>/dev/null || true
RUN a2ensite 000-default.conf

# Run deployment script
RUN /usr/local/bin/deploy.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start Apache in foreground
CMD ["apache2-foreground"]
