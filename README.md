# CarShop - E-Commerce Platform for Auto Parts

A complete, responsive e-commerce platform for selling cars and automobile parts. Built with HTML, CSS, JavaScript, and PHP with MySQL database.

## Features

✅ **User Authentication**
- User registration and login
- Secure password hashing with PHP password_hash()
- Session management

✅ **Product Catalog**
- Browse products by category
- Search functionality
- Price filtering
- Product details modal with images

✅ **Shopping Cart**
- Add/remove products
- Update quantities
- Real-time cart count updates
- Cart persistence

✅ **Checkout System**
- Order review with itemized list
- Tax calculation (10%)
- Order totals

✅ **Payment Methods**
- Credit/Debit Card payment
- M-Pesa mobile payment integration
- Form validation

✅ **Order Management**
- Order history
- Order details with items
- Order status tracking
- Successful payment confirmation

✅ **Responsive Design**
- Mobile-friendly (320px and up)
- Tablet optimized (768px)
- Desktop optimized (1200px+)
- Smooth animations and transitions

## Project Structure

```
car-shop/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── shop.html               # Product catalog
├── cart.html               # Shopping cart
├── checkout.html           # Payment & checkout
├── success.html            # Purchase confirmation
├── orders.html             # Order history
│
├── css/
│   └── style.css          # All responsive styling
│
├── js/
│   ├── validation.js      # Form validation
│   ├── shop.js            # Product & category management
│   ├── cart.js            # Cart functionality
│   ├── checkout.js        # Payment processing
│   ├── success.js         # Success page logic
│   └── orders.js          # Order history display
│
├── php/
│   ├── config.php         # Database configuration
│   ├── auth.php           # Login/Registration
│   ├── products.php       # Product operations
│   ├── cart.php           # Cart management
│   ├── orders.php         # Order creation & retrieval
│   └── payment.php        # Payment processing
│
├── images/                # Product images folder
│
└── database.sql           # Database schema & sample data
```

## Database Setup

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Web server (Apache, Nginx, etc.)

### Installation Steps

1. **Create the database:**
   ```sql
   mysql -u root -p < database.sql
   ```

2. **Update database credentials in `php/config.php`:**
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'car_shop');
   ```

3. **Place files in your web root:**
   - For Apache: `htdocs/car-shop/`
   - For Nginx: `public_html/car-shop/`

## Database Tables

### users
Stores user account information and credentials

```
Columns: id, username, email, password, full_name, phone, address, created_at
```

### products
Contains all available products/parts

```
Columns: id, name, category, description, price, stock, image_url, created_at
```

### orders
Tracks customer orders

```
Columns: id, user_id, total_amount, payment_method, status, order_date
```

### order_items
Details of products in each order

```
Columns: id, order_id, product_id, quantity, unit_price, total_price
```

## Usage Guide

### For Customers

1. **Register** - Create a new account at `register.html`
2. **Browse** - Browse products at `shop.html`
   - Filter by category
   - Adjust price range
   - Search for specific items
3. **Add to Cart** - Click "View Details" and add items to cart
4. **Checkout** - Proceed to checkout from cart page
5. **Payment** - Choose payment method (Card or M-Pesa)
6. **Confirmation** - View order confirmation at `success.html`
7. **Track Orders** - View order history at `orders.html`

### Sample Products
The database includes 10 sample products across categories:
- Engines
- Transmission
- Brakes
- Suspension
- Electrical
- Cooling
- Filters
- Fuel System

### Test Credentials
After running the SQL file, you can create test accounts by registering new users.

## Payment Methods

### Credit/Debit Card
- Accepts 13+ digit card numbers
- Requires expiry date (MM/YY) and CVV (3 digits)
- Form validation on client and server side

### M-Pesa
- Accepts phone number input
- Simulates STK push notification
- Transaction ID generation

## Responsive Breakpoints

- **Mobile**: 480px and below
- **Tablet**: 481px - 768px  
- **Desktop**: 769px+

## Features by Page

### index.html
- Marketing landing page
- Feature showcase
- Call-to-action buttons

### login.html
- Email & password login
- Error handling
- Link to registration

### register.html
- Form validation
- Password confirmation
- Optional phone/address fields

### shop.html
- Product grid display
- Category filtering
- Price range slider
- Search functionality
- Add to cart modal

### cart.html
- Item list with images
- Quantity controls
- Real-time totals
- Tax calculation

### checkout.html
- Order review table
- Payment method selection
- Card/M-Pesa forms
- Order processing

### success.html
- Animated success icon
- Order details display
- Next steps information
- Continue shopping button

### orders.html
- Order history list
- Status badges
- Order details modal
- Item breakdown

## Security Considerations

✅ Implemented:
- Password hashing using PHP's password_hash()
- SQL escaping with real_escape_string()
- Session-based authentication
- Input validation and sanitization

⚠️ For Production:
- Use prepared statements instead of string concatenation
- Implement HTTPS/SSL
- Add CSRF tokens
- Use environment variables for database credentials
- Implement rate limiting
- Add email verification
- Implement real payment gateway integration

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Endpoints

### Authentication
- `POST /php/auth.php` - Login/Register

### Products
- `GET /php/products.php?action=get_all` - All products
- `GET /php/products.php?action=get_single&id=X` - Single product
- `GET /php/products.php?action=get_by_category&category=X` - By category
- `GET /php/products.php?action=search&query=X` - Search

### Cart
- `GET /php/cart.php?action=get_cart` - Get cart
- `POST /php/cart.php` - Add/Update/Remove/Clear cart

### Orders
- `POST /php/orders.php?action=create` - Create order
- `GET /php/orders.php?action=get_orders` - User orders
- `GET /php/orders.php?action=get_order_details&order_id=X` - Order details

### Payment
- `POST /php/payment.php?action=process_payment` - Process payment

## Customization

### Add Product Images
1. Place images in `/images/` folder
2. Update `image_url` in products table
3. Update `getCategoryEmoji()` in `js/shop.js` for custom emojis

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    /* ... */
}
```

### Add Categories
Insert into products table:
```sql
INSERT INTO products (name, category, description, price, stock, image_url)
VALUES ('Product Name', 'New Category', 'Description', 50000, 10, 'image.jpg');
```

## Troubleshooting

**Database Connection Error**
- Check database credentials in `php/config.php`
- Verify MySQL is running
- Check database exists: `SHOW DATABASES;`

**Cart Not Persisting**
- Sessions must be enabled in PHP
- Check `session.save_path` is writable
- Verify cookies are enabled in browser

**Images Not Loading**
- Check `/images/` folder exists
- Verify image paths in database
- Check file permissions (644)

**Payment Not Processing**
- Check form validation passes
- Verify POST data is correct
- Check browser console for JavaScript errors

## Future Enhancements

- Real payment gateway integration (Stripe, M-Pesa API)
- Email notifications
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality
- Order tracking with shipping status
- Inventory management
- Customer support chat
- Product recommendations

## License

This project is open source and available for educational purposes.

## Hosting on Render.com

### Quick Start (5 Minutes)

See **RENDER_QUICK_START.md** for step-by-step deployment guide.

### Full Hosting Guide

See **HOSTING_GUIDE.md** for detailed instructions on:
- Setting up GitHub repository
- Creating Render web service
- Configuring database (Railway/PlanetScale/SQLite)
- Initializing database
- Deploying your site

### Deployment Checklist

See **DEPLOYMENT_CHECKLIST.md** for comprehensive checklist covering:
- Pre-deployment testing
- GitHub setup
- Database configuration
- Render deployment
- Post-deployment verification
- Monitoring and maintenance

### Troubleshooting

See **RENDER_TROUBLESHOOTING.md** for solutions to:
- 502 Bad Gateway errors
- Database connection issues
- Session/login problems
- Performance optimization
- Image loading issues
- Payment processing problems
- Emergency procedures

## Support

For issues or questions, check:
1. **RENDER_QUICK_START.md** - Quick deployment guide
2. **HOSTING_GUIDE.md** - Detailed hosting instructions
3. **RENDER_TROUBLESHOOTING.md** - Common issues & solutions
4. **DEPLOYMENT_CHECKLIST.md** - Full deployment checklist
5. Browser console for JavaScript errors
6. Render Dashboard Logs for PHP errors
7. MySQL/Railway logs for database errors

## Resources

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **PlanetScale Docs**: https://planetscale.com/docs
- **PHP Manual**: https://php.net
- **MySQL Docs**: https://dev.mysql.com/doc/

---

**Happy Shopping! 🚗**

Your CarShop is ready to go live!

**Next Steps:**
1. Read RENDER_QUICK_START.md
2. Set up GitHub repository
3. Deploy on Render.com
4. Run setup.php to initialize database
5. Test all features
6. Share with users!
