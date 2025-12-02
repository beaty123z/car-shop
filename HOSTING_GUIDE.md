# Hosting CarShop on Render.com (Free Plan)

This guide will help you deploy your CarShop application on Render.com using the free tier.

## Prerequisites

1. **GitHub Account** - Create one at https://github.com
2. **Render Account** - Sign up at https://render.com (free)
3. **Git** - Install from https://git-scm.com

## Step 1: Prepare Your Project for Render

### 1.1 Create .env File for Environment Variables

Create `.env` file in root directory:

```
DB_HOST=localhost
DB_USER=carshop_user
DB_PASS=your_secure_password_here
DB_NAME=car_shop
PORT=8000
```

### 1.2 Update php/config.php to Use Environment Variables

Replace your database credentials with environment variable reading:

```php
<?php
// Database configuration
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_name = getenv('DB_NAME') ?: 'car_shop';

define('DB_HOST', $db_host);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
define('DB_NAME', $db_name);

// ... rest of config.php
?>
```

## Step 2: Push Code to GitHub

### 2.1 Create GitHub Repository

1. Go to https://github.com/new
2. Name it `carshop`
3. Click "Create repository"
4. Don't initialize with README

### 2.2 Push Your Project

In your project directory:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial CarShop commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/carshop.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Create Render Web Service

### 3.1 Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub account
5. Select the `carshop` repository
6. Configure:
   - **Name**: `carshop`
   - **Environment**: `PHP`
   - **Build Command**: Leave empty (Render auto-detects)
   - **Start Command**: `php -S 0.0.0.0:${PORT:-8000} -t .`
   - **Plan**: Free (default)

### 3.2 Add Environment Variables

1. Scroll to **Environment**
2. Add these variables:

```
DB_HOST=localhost
DB_USER=carshop_user
DB_PASS=YourSecurePassword123!
DB_NAME=car_shop
```

3. Click **"Create Web Service"**

Render will deploy your site. Wait 5-10 minutes for it to finish.

## Step 4: Set Up MySQL Database

Unfortunately, Render.com's free plan **does NOT include free MySQL**. You have 3 options:

### Option A: Use Free Tier Services (Recommended)

#### Use Railway.app (Free MySQL)

1. Go to https://railway.app
2. Click **"New Project"** → **"Database"** → **"MySQL"**
3. Get connection details:
   - Host
   - Port (usually 3306)
   - Username
   - Password
   - Database name

4. Update your Render environment variables with Railway's details:
   ```
   DB_HOST=railway_host_from_railway.app
   DB_USER=root
   DB_PASS=your_railway_password
   DB_NAME=railway
   ```

#### Alternative: Use PlanetScale (Free MySQL Compatible)

1. Go to https://planetscale.com
2. Sign up (GitHub login recommended)
3. Create new database
4. Get connection string (MySQL format)
5. Update environment variables in Render

### Option B: Use SQLite (No External DB Needed)

Modify `php/config.php` to use SQLite instead:

```php
<?php
$db_type = getenv('DB_TYPE') ?: 'mysql';

if ($db_type === 'sqlite') {
    $sqlite_db = __DIR__ . '/../data/carshop.db';
    if (!file_exists(dirname($sqlite_db))) {
        mkdir(dirname($sqlite_db), 0755, true);
    }
    
    $conn = new PDO('sqlite:' . $sqlite_db);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} else {
    // MySQL connection (existing code)
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}
?>
```

### Option C: Paid Option (Upgrade Render)

1. Upgrade to **Render's Pro Plan** ($7/month minimum)
2. Includes PostgreSQL/MySQL database
3. Better for production use

## Step 5: Initialize Database on Render

After setting up your database service, run the SQL script:

```bash
# From your local machine, connect to remote database
mysql -h your_db_host -u your_db_user -p your_db_name < database.sql
```

Or create a setup script on Render:

Create `setup.php` in root:

```php
<?php
require 'php/config.php';

// Read SQL file
$sql = file_get_contents('database.sql');

// Split by semicolon and execute
$queries = array_filter(array_map('trim', explode(';', $sql)));

foreach ($queries as $query) {
    if (!empty($query)) {
        try {
            $conn->query($query);
            echo "✓ Executed: " . substr($query, 0, 50) . "...\n";
        } catch (Exception $e) {
            echo "✗ Error: " . $e->getMessage() . "\n";
        }
    }
}

echo "\nDatabase setup complete!";
?>
```

Visit: `https://your-carshop-site.onrender.com/setup.php`

## Step 6: Access Your Site

Your site will be available at:
```
https://carshop.onrender.com
```
(Render generates the subdomain from your app name)

## Troubleshooting

### Site Shows 502 Bad Gateway

**Causes & Solutions:**
1. **Database not connected** - Check DB_HOST, DB_USER, DB_PASS in Environment
2. **PHP errors** - Check Logs in Render dashboard
3. **Port not set** - Ensure PORT environment variable exists
4. **Missing files** - Verify all files pushed to GitHub

**Fix:**
1. Go to Render dashboard → Logs
2. Look for PHP error messages
3. Check database connection in `php/config.php`
4. Redeploy: Click "Manual Deploy"

### Database Connection Error

```
Error: Connection failed: Unknown database host
```

**Solution:**
1. Verify DB_HOST is correct (include full hostname from Railway/PlanetScale)
2. Check DB_USER and DB_PASS match
3. Ensure database exists
4. Test connection locally first

### Session Not Working

**Solution:**
Render uses ephemeral storage. Add session handler to `php/config.php`:

```php
<?php
session_save_path('/tmp');
session_start();
?>
```

### Images Not Loading

**Solution:**
Store images in an external service:
- **AWS S3** - Free tier available
- **Cloudinary** - Free tier with limits
- **Imgur** - Free image hosting

Update `image_url` in database to use external URLs.

## Update & Redeploy

To update your site:

```bash
# Make changes locally
git add .
git commit -m "Update description"
git push origin main
```

Render automatically redeploys when you push to GitHub!

## Performance Tips

1. **Minimize Database Queries** - Cache frequently accessed data
2. **Use CDN** - Add Cloudflare (free) for static assets
3. **Enable Compression** - Add this to `public/index.php`:
   ```php
   ob_start('ob_gzhandler');
   ```

4. **Optimize Images** - Use WebP format
5. **Add Caching Headers** - Cache static files for 30 days

## Security Checklist

- ✅ Use HTTPS (Render provides free SSL)
- ✅ Store sensitive data in Environment Variables
- ✅ Use prepared statements (already done in code)
- ✅ Validate all user inputs
- ✅ Use strong database passwords
- ✅ Keep PHP updated
- ✅ Regular backups of database

## Production Checklist

- [ ] Database is backed up
- [ ] Environment variables are secure
- [ ] SSL certificate is active
- [ ] Error logging is configured
- [ ] Monitor uptime (Render provides monitoring)
- [ ] Set up error alerts
- [ ] Test payment processing
- [ ] Verify email notifications work
- [ ] Document deployment procedure
- [ ] Create disaster recovery plan

## Free Tier Limitations

**Render.com Free Plan:**
- ✅ 1 free web service
- ✅ Auto-deployed from GitHub
- ✅ Free SSL/HTTPS
- ✅ Auto-sleeping after 15 minutes of inactivity
- ✅ Wakes up on request (cold start ~30 sec)
- ❌ No built-in database (use Railway/PlanetScale)
- ❌ Limited to 1 concurrent request during cold start
- ❌ Ephemeral disk (files deleted on restart)

## Upgrade to Production

When you need production performance:

1. **Render Pro Plan** ($7/month+)
   - Faster deployments
   - Better performance
   - PostgreSQL database included

2. **Use Separate Services**
   - Railway for MySQL ($5/month)
   - Render for web service ($7/month)
   - Cloudflare for CDN (free)

3. **Consider Alternatives**
   - **Heroku** - Similar pricing
   - **DigitalOcean App Platform** - $5-12/month
   - **Linode** - $5/month VPS
   - **AWS** - Complex but scalable

## Support Resources

- Render Docs: https://render.com/docs
- PHP Documentation: https://php.net/docs
- MySQL Documentation: https://dev.mysql.com/doc/

## Next Steps

1. Set up GitHub repository
2. Connect to Render
3. Configure database (Railway/PlanetScale)
4. Run `setup.php` to initialize database
5. Test all features
6. Monitor logs for errors
7. Set up automatic backups

---

**Your CarShop is now live! 🚀**

Visit your Render dashboard to monitor performance and logs.
