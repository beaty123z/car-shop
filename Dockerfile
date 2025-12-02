FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Install PostgreSQL PDO extension
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY --chown=www-data:www-data . .

# Configure Apache
RUN echo "Listen \${PORT:-8000}" > /etc/apache2/ports.conf

# Configure VirtualHost
RUN cat > /etc/apache2/sites-enabled/000-default.conf <<EOF
<VirtualHost *:\${PORT:-8000}>
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Create a simple health check
RUN echo "<?php echo 'CarShop is running!'; ?>" > /var/www/html/health.php

# Start Apache
CMD ["apache2-foreground"]
