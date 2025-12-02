-- Car Shop Database Schema for PostgreSQL

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sample Products
INSERT INTO products (name, category, description, price, stock, image_url) VALUES
('Toyota Corolla Engine', 'Engine', 'Complete engine assembly for Toyota Corolla', 45000.00, 5, 'engine1.jpg'),
('Honda Civic Transmission', 'Transmission', 'Automatic transmission for Honda Civic', 38000.00, 3, 'transmission1.jpg'),
('Brake Pads Set', 'Brakes', 'High-quality brake pads for all car models', 5000.00, 20, 'brakes1.jpg'),
('Suspension Kit', 'Suspension', 'Complete suspension system upgrade kit', 28000.00, 4, 'suspension1.jpg'),
('Car Battery 12V', 'Electrical', 'Powerful 12V car battery with warranty', 8000.00, 15, 'battery1.jpg'),
('Radiator Assembly', 'Cooling', 'Aluminum radiator for efficient cooling', 12000.00, 6, 'radiator1.jpg'),
('Turbocharger Kit', 'Engine Parts', 'Performance turbocharger for engines', 65000.00, 2, 'turbo1.jpg'),
('Air Filter Premium', 'Filters', 'Reusable high-performance air filter', 3500.00, 25, 'airfilter1.jpg'),
('Fuel Pump Assembly', 'Fuel System', 'Electric fuel pump with injectors', 15000.00, 8, 'fuelpump1.jpg'),
('Spark Plugs Set', 'Electrical', 'Premium spark plugs for all engines', 2500.00, 30, 'sparkplugs1.jpg');
