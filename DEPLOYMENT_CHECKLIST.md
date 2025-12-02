# Render.com Deployment Checklist

## Pre-Deployment ✓

### Local Testing
- [ ] All pages load without errors (`index.html`, `login.html`, `register.html`, `shop.html`, `cart.html`, `checkout.html`)
- [ ] Registration form works
- [ ] Login functionality works
- [ ] Can add products to cart
- [ ] Cart calculations correct (subtotal, tax, total)
- [ ] Checkout process completes without errors

### Code Cleanup
- [ ] Remove any debug code or console.log statements
- [ ] Check for console errors (F12 → Console)
- [ ] Verify all file paths are correct
- [ ] No hardcoded localhost URLs

## GitHub Setup ✓

### Repository
- [ ] Create GitHub account (if not already done)
- [ ] Create new repository named `carshop`
- [ ] Add `.gitignore` to exclude:
  - `.env` (environment variables)
  - `.env.local`
  - `vendor/` (PHP dependencies)
  - `node_modules/` (if applicable)

### Push Code
```bash
git init
git add .
git commit -m "Initial CarShop commit"
git remote add origin https://github.com/YOUR_USERNAME/carshop.git
git branch -M main
git push -u origin main
```

- [ ] Verify code is on GitHub
- [ ] Main branch is selected as default

## Database Setup ✓

### Choose Database Provider

#### Option A: Railway.app (Recommended - Free MySQL)
- [ ] Create Railway.app account (https://railway.app)
- [ ] Create new MySQL project
- [ ] Note down connection details:
  ```
  Host: your_host.railway.app
  Port: 3306
  Username: root
  Password: your_password
  Database: railway
  ```
- [ ] Test connection locally

#### Option B: PlanetScale (MySQL Compatible)
- [ ] Create PlanetScale account (https://planetscale.com)
- [ ] Create new database
- [ ] Create new branch
- [ ] Get connection string
- [ ] Note username, password, host

#### Option C: SQLite (Simplest - No External DB)
- [ ] Use SQLite (included in PHP)
- [ ] Modify `php/config.php` for SQLite
- [ ] No external setup needed

## Render.com Setup ✓

### Create Web Service
- [ ] Log in to Render.com (https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `carshop` repository
- [ ] Configure:
  - [ ] **Name**: `carshop`
  - [ ] **Environment**: PHP
  - [ ] **Start Command**: `php -S 0.0.0.0:${PORT:-8000} -t .`
  - [ ] **Plan**: Free tier
  - [ ] **Region**: Choose closest region

### Environment Variables
In Render dashboard → Environment Variables:

```
DB_HOST=<YOUR_DATABASE_HOST>
DB_USER=root
DB_PASS=<YOUR_DATABASE_PASSWORD>
DB_NAME=<YOUR_DATABASE_NAME>
```

- [ ] DB_HOST correctly entered
- [ ] DB_USER set to `root`
- [ ] DB_PASS set to secure password
- [ ] DB_NAME set to database name
- [ ] Click "Save"

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check status in Logs
- [ ] Verify URL appears as `https://carshop.onrender.com`

## Post-Deployment ✓

### Initialize Database
- [ ] Visit `https://your-carshop.onrender.com/setup.php`
- [ ] Verify tables created successfully
- [ ] Check for errors in setup output
- [ ] Verify sample products inserted

### Test Core Features
- [ ] Homepage loads (`/index.html`)
- [ ] Registration works (`/register.html`)
  - [ ] Create test account
  - [ ] Verify user in database (if possible)
- [ ] Login works (`/login.html`)
  - [ ] Login with test account
  - [ ] Verify session maintained
- [ ] Shop page loads (`/shop.html`)
  - [ ] Products display with categories
  - [ ] Category filter works
  - [ ] Price filter works
  - [ ] Search works
- [ ] Add to cart works
  - [ ] Product modal opens
  - [ ] Can adjust quantity
  - [ ] "Add to cart" button works
  - [ ] Cart count updates
- [ ] Cart page works (`/cart.html`)
  - [ ] Items listed correctly
  - [ ] Quantities editable
  - [ ] Totals calculated correctly
  - [ ] Remove item works
- [ ] Checkout works (`/checkout.html`)
  - [ ] Order review displays correctly
  - [ ] Tax calculated (10%)
  - [ ] Payment methods toggle
  - [ ] Card form validates
  - [ ] M-Pesa phone validation works
  - [ ] "Complete Payment" button processes
- [ ] Success page shows (`/success.html`)
  - [ ] Order ID displays
  - [ ] Order total correct
  - [ ] Payment method shown
  - [ ] Can navigate back to shop

### Verify Performance
- [ ] Pages load in < 3 seconds
- [ ] No console errors (F12 → Console)
- [ ] Images load correctly
- [ ] Responsive on mobile (test with DevTools)
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Security Check
- [ ] No console errors showing secrets
- [ ] Database credentials in environment variables only
- [ ] `.env` not in GitHub (check .gitignore)
- [ ] No hardcoded passwords in code
- [ ] HTTPS enabled (Render provides free SSL)

## Monitoring ✓

### Logs & Errors
- [ ] Check Render Logs regularly
- [ ] Look for PHP errors
- [ ] Monitor database connection errors
- [ ] Subscribe to error alerts (if available)

### Uptime
- [ ] Set up monitoring (Render provides basic monitoring)
- [ ] Note: Free tier auto-sleeps after 15 minutes of inactivity
- [ ] First request after sleep takes 30-45 seconds (normal)

### Backups
- [ ] Backup database daily (automated via Railway/PlanetScale)
- [ ] Export database regularly:
  ```bash
  mysqldump -h <host> -u <user> -p <database> > backup.sql
  ```

## Maintenance ✓

### Weekly
- [ ] Check error logs
- [ ] Test critical paths (register → login → checkout)
- [ ] Monitor database size

### Monthly
- [ ] Review performance metrics
- [ ] Update dependencies (if using Composer)
- [ ] Verify backups working
- [ ] Check for security patches

### Quarterly
- [ ] Full system backup
- [ ] Load testing
- [ ] Security audit
- [ ] Update documentation

## Troubleshooting Checklist

### Site Shows 502 Bad Gateway
- [ ] Check Render Logs (Dashboard → Logs)
- [ ] Verify all environment variables set
- [ ] Check database connection
- [ ] Verify start command correct
- [ ] Try manual redeploy (Dashboard → Manual Deploy)

### Database Connection Error
- [ ] Verify DB_HOST is correct (with full domain from Railway)
- [ ] Verify DB_USER = `root`
- [ ] Verify DB_PASS matches
- [ ] Verify DB_NAME matches
- [ ] Test connection locally first
- [ ] Check firewall/network access (shouldn't be issue with Railway)

### Sessions Not Persisting
- [ ] Check session.save_path is writable
- [ ] Verify cookies enabled
- [ ] Check for session_start() in all files
- [ ] Review browser cookie settings

### Performance Issues
- [ ] Free tier auto-sleeps (normal)
- [ ] Upgrade to paid tier for faster response
- [ ] Optimize database queries
- [ ] Add caching layer
- [ ] Use CDN for static files (Cloudflare - free)

### Images Not Loading
- [ ] Check image paths in database
- [ ] Verify images in `/images/` folder
- [ ] Use external image hosting (Cloudinary, Imgur)
- [ ] Update `image_url` in database

## Useful Commands

### View Logs
```bash
# Render provides logs in dashboard
# Or use: render logs <service-id>
```

### Database Connection Test
```bash
mysql -h <host> -u root -p -e "SELECT 1"
```

### Redeploy
```bash
git push origin main  # Automatic redeploy on GitHub push
```

## Getting Help

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **PlanetScale Docs**: https://planetscale.com/docs
- **PHP Manual**: https://php.net
- **MySQL Docs**: https://dev.mysql.com/doc/

## Success Indicators ✅

You've successfully deployed if:

- ✅ Site loads without 502 errors
- ✅ Users can register and login
- ✅ Products display correctly
- ✅ Cart functionality works
- ✅ Checkout completes
- ✅ Database persists data
- ✅ Pages respond in < 3 seconds
- ✅ No console errors
- ✅ Mobile responsive
- ✅ HTTPS working

---

**Deployment Complete! Your CarShop is live on Render.com 🚀**

Next: Monitor performance and gather user feedback for improvements.
