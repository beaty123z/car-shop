# CarShop Deployment Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                           │
│                  https://carshop.onrender.com                │
└────────────────────────────────┬─────────────────────────────┘
                                 │
                                 │ HTTPS (Free SSL)
                                 │
┌────────────────────────────────▼─────────────────────────────┐
│                    RENDER.COM (Web Service)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PHP Development Server                                │  │
│  │  $ php -S 0.0.0.0:${PORT} -t .                        │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ public/index.php (Router)                        │ │  │
│  │  │ - Routes requests to appropriate files           │ │  │
│  │  │ - Serves static files (HTML, CSS, JS, images)    │ │  │
│  │  │ - Routes /php/* to PHP backends                  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ Static Assets                                    │ │  │
│  │  │ - index.html, login.html, shop.html, etc        │ │  │
│  │  │ - css/style.css                                 │ │  │
│  │  │ - js/*.js                                       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ PHP Backend (API Endpoints)                      │ │  │
│  │  │ - php/auth.php (Login/Register)                 │ │  │
│  │  │ - php/products.php (Get products, search)        │ │  │
│  │  │ - php/cart.php (Cart operations)                 │ │  │
│  │  │ - php/orders.php (Order creation)                │ │  │
│  │  │ - php/payment.php (Payment processing)           │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  Environment Variables (from Render Dashboard):        │  │
│  │  - DB_HOST=mysql.railway.internal                     │  │
│  │  - DB_USER=root                                       │  │
│  │  - DB_PASS=xxxxx                                      │  │
│  │  - DB_NAME=railway                                    │  │
│  │  - PORT=8000                                          │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Auto-deploys from: https://github.com/YOUR_USERNAME/carshop│
│  Redeploys on every `git push` to main branch                │
│                                                               │
└──────────────────────────────────┬──────────────────────────┘
                                   │
                                   │ TCP Connection
                                   │ Port 3306
                                   │
┌──────────────────────────────────▼──────────────────────────┐
│              RAILWAY.APP (MySQL Database)                   │
├───────────────────────────────────────────────────────────┤
│                                                             │
│  MySQL Database: "railway"                                │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Tables:                                            │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ users                                              │   │
│  │ - id, username, email, password, full_name,        │   │
│  │   phone, address, created_at                        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ products                                            │   │
│  │ - id, name, category, description, price,          │   │
│  │   stock, image_url, created_at                      │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ orders                                              │   │
│  │ - id, user_id, total_amount, payment_method,        │   │
│  │   status, order_date                                │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ order_items                                         │   │
│  │ - id, order_id, product_id, quantity,               │   │
│  │   unit_price, total_price                           │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  • Auto-backups enabled                                    │
│  • Connection pooling for performance                      │
│  • Free tier limits: ~500MB storage                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ACTION                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    Register           Login             Browse Shop
        │                  │                  │
        │                  │                  │
        ├─►auth.php◄──────┴──────────────────┤
        │   ├─ Validate input               │
        │   ├─ Hash password                │
        │   ├─ Query users table            │
        │   └─ Return success/error         │
        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                           ▼
                    Session Started
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    Add to Cart       Search Products      Filter by Price
        │                  │                  │
        │                  ▼                  │
        ├──────────────────┤                  │
        │          products.php               │
        │          ├─ Query products table   │
        │          ├─ Apply filters          │
        │          ├─ Return JSON            │
        │          └─ JavaScript displays    │
        │                  │                  │
        ▼                  ▼                  ▼
    cart.php                              Proceed to Checkout
    ├─ Store in session
    ├─ Calculate totals
    └─ Return cart JSON
                           │
                           ▼
                    checkout.html
                    ├─ Display order review
                    ├─ Select payment method
                    └─ Enter payment details
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
                 Card         M-Pesa
              (Simulated)   (Simulated)
                    │             │
                    └──────┬──────┘
                           │
                    ▼ payment.php
                    ├─ Validate inputs
                    ├─ Process payment
                    └─ Return success
                           │
                    ▼ orders.php
                    ├─ Create order
                    ├─ Insert order items
                    ├─ Update stock
                    └─ Return order_id
                           │
                    ▼ success.html
                    ├─ Display confirmation
                    ├─ Show order details
                    └─ Option to continue shopping
```

## File Structure

```
carshop/
│
├── 📄 index.html                 [Home page with features]
├── 📄 login.html                 [User login]
├── 📄 register.html              [User registration]
├── 📄 shop.html                  [Product catalog]
├── 📄 cart.html                  [Shopping cart]
├── 📄 checkout.html              [Payment & checkout]
├── 📄 success.html               [Order confirmation]
├── 📄 orders.html                [Order history - optional]
│
├── 📁 css/
│   └── 📄 style.css              [All responsive styling]
│
├── 📁 js/
│   ├── 📄 validation.js          [Form validation]
│   ├── 📄 shop.js                [Product & filter logic]
│   ├── 📄 cart.js                [Cart operations]
│   ├── 📄 checkout.js            [Payment handling]
│   ├── 📄 success.js             [Success page logic]
│   └── 📄 orders.js              [Order history - optional]
│
├── 📁 php/
│   ├── 📄 config.php             [Database connection]
│   ├── 📄 auth.php               [Login/Registration]
│   ├── 📄 products.php           [Product queries]
│   ├── 📄 cart.php               [Cart session handling]
│   ├── 📄 orders.php             [Order operations]
│   └── 📄 payment.php            [Payment processing]
│
├── 📁 public/
│   └── 📄 index.php              [Router - serves all files]
│
├── 📁 images/                    [Product images - optional]
│
├── 📄 database.sql               [Database schema & data]
├── 📄 setup.php                  [Initialize database on Render]
├── 📄 .env.example               [Environment template]
├── 📄 .gitignore                 [Git ignore rules]
├── 📄 Procfile                   [Render deployment config]
│
└── 📄 Documentation Files:
    ├── 📄 README.md
    ├── 📄 HOSTING_GUIDE.md
    ├── 📄 RENDER_QUICK_START.md
    ├── 📄 DEPLOYMENT_CHECKLIST.md
    ├── 📄 RENDER_TROUBLESHOOTING.md
    ├── 📄 QUICK_REFERENCE.md
    ├── 📄 DEPLOYMENT_SUMMARY.md
    └── 📄 ARCHITECTURE.md (this file)
```

## Request Flow Example: "Add to Cart"

```
Browser (JavaScript)
    │
    └─► fetch('php/cart.php', {
            method: 'POST',
            body: FormData {
                action: 'add',
                product_id: 5,
                quantity: 2
            }
        })
            │
            └─► HTTP POST Request
                    │
                    └─► Render.com Router (public/index.php)
                            │
                            └─► Routes to php/cart.php
                                    │
                                    ├─► php/config.php
                                    │   └─► Load .env (DB credentials)
                                    │
                                    ├─► Database Query (MySQL)
                                    │   SELECT * FROM products WHERE id=5
                                    │
                                    ├─► Session Storage
                                    │   $_SESSION['cart'][] = [...]
                                    │
                                    └─► JSON Response
                                            │
                                            └─► Browser
                                                └─► JavaScript processes
                                                    └─► Updates UI
                                                        └─► Cart count increases
```

## Database Query Example

```
User clicks "Add to Cart" for Product ID 5

1. Frontend (js/shop.js):
   - Validates quantity
   - Sends AJAX request to php/cart.php

2. Backend (php/cart.php):
   - Receives product_id=5, quantity=2
   - Queries database:
     SELECT * FROM products WHERE id=5
   
3. Database Response:
   {
     id: 5,
     name: "Suspension Kit",
     price: 28000,
     stock: 4,
     ...
   }

4. PHP Logic:
   - Validates: quantity (2) <= stock (4) ✓
   - Stores in session: $_SESSION['cart'][5] = {quantity: 2, ...}
   - Returns: {success: "Product added to cart"}

5. Frontend Updates:
   - Cart count changes: 0 → 1
   - Shows toast notification
   - Closes modal
```

## Security Architecture

```
┌─────────────────────────────────┐
│   HTTPS (TLS/SSL) Encryption    │
│   (Free via Render.com)         │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   PHP Input Validation           │
│   - Sanitize user input          │
│   - Type checking                │
│   - Length validation            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   SQL Injection Prevention       │
│   - real_escape_string()         │
│   - Parameterized queries ready  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Password Security              │
│   - bcrypt hashing               │
│   - password_hash()              │
│   - password_verify()            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Session Security               │
│   - session_start()              │
│   - Session timeout: 24 hours    │
│   - Cookies HttpOnly ready       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Environment Variables          │
│   - Secrets in Render dashboard  │
│   - Not in GitHub (.gitignore)   │
│   - Not in code files            │
└─────────────────────────────────┘
```

## Scalability Path

```
Phase 1: Launch (Free)
├─ Render: Free tier ($0)
├─ Railway: Free MySQL ($0)
├─ Estimated: 100-500 users/month
└─ Performance: Adequate for MVP

    ▼ (When you hit ~50 concurrent users)

Phase 2: Growth (Budget: $12/month)
├─ Render: Pro tier ($7/month)
├─ Railway: Paid MySQL ($5/month)
├─ Estimated: 1,000-5,000 users/month
├─ Features: Instant startup, better performance
└─ Performance: Good for small business

    ▼ (When you hit ~200 concurrent users)

Phase 3: Scale (Budget: $50+/month)
├─ Render: Premium tier ($25+/month)
├─ Railway: Premium MySQL ($20+/month)
├─ Cloudflare: Pro tier ($20/month)
├─ Estimated: 10,000+ users/month
├─ Features: Global CDN, advanced caching
└─ Performance: Enterprise-grade

    ▼ (When you hit capacity)

Phase 4: Enterprise
├─ Dedicated servers (DigitalOcean, Linode, etc.)
├─ Load balancing
├─ Database replication
├─ Caching layer (Redis)
├─ Multiple regions
└─ Custom infrastructure
```

## Development to Production Flow

```
LOCAL DEVELOPMENT
│
├─ Edit files
├─ Run: php -S localhost:8000
├─ Test in browser: localhost:8000
├─ Check PHP errors in console
├─ Test database operations
└─ Verify all features work
    │
    ▼
COMMIT TO GITHUB
    │
    ├─ git add .
    ├─ git commit -m "description"
    └─ git push origin main
        │
        ▼
GITHUB
    │
    └─ Webhook triggers Render
        │
        ▼
RENDER BUILD
    │
    ├─ Clone latest code
    ├─ Install dependencies
    ├─ Run build script (optional)
    └─ Start PHP server
        │
        ▼
RENDER DEPLOY
    │
    ├─ Replace running service
    ├─ Update HTTPS certificate
    ├─ Enable traffic to new version
    └─ Monitor health
        │
        ▼
PRODUCTION LIVE
    │
    ├─ https://carshop.onrender.com live
    ├─ All users using new code
    ├─ Database persistent
    └─ Monitoring active
```

---

**For questions about architecture, see HOSTING_GUIDE.md**
