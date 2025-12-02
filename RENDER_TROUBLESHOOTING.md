# Render.com Troubleshooting Guide

## Common Issues & Solutions

### 1. 502 Bad Gateway Error

**Symptoms:**
- Site shows "502 Bad Gateway" or "Service Unavailable"
- Everything worked locally

**Causes & Solutions:**

#### A. Database Connection Failed
```php
// Check these in Render Environment Variables:
DB_HOST=mysql.railway.internal  // NOT localhost!
DB_USER=root
DB_PASS=your_password
DB_NAME=railway
```

**Fix:**
1. Go to Render Dashboard
2. Select your service
3. Click "Environment"
4. Verify DB_HOST is NOT "localhost"
5. Click "Save"
6. Click "Manual Deploy"

#### B. Port Configuration Issue
**Fix:**
1. Ensure Start Command is: `php -S 0.0.0.0:${PORT:-8000} -t .`
2. Don't hardcode port (like `8000`)
3. Must use `${PORT:-8000}` format
4. Click "Manual Deploy"

#### C. PHP Syntax Error
**Fix:**
1. Check Render Logs (Dashboard → Logs)
2. Look for PHP error messages
3. Fix error locally
4. Push to GitHub
5. Render auto-redeploys

**View Logs:**
```
Render Dashboard → Select Service → Logs
Look for PHP errors like:
- Parse error
- Fatal error
- Warning
```

---

### 2. Database Connection Failed

**Error Message:**
```
Error: Connection failed: Unknown database host
```

**Solution:**

#### Check Credentials
```bash
# Test locally with Railway/PlanetScale credentials:
mysql -h <host> -u root -p -e "SELECT 1"
```

#### Verify Environment Variables in Render
```
DB_HOST=your_railway_host.railway.internal
DB_USER=root
DB_PASS=your_password (should be long/complex)
DB_NAME=railway
```

#### Check .env.example is not being used
Delete/rename: `.env.example` (this is just a template)

#### Railway-Specific
If using Railway:
- Host should end in `.railway.internal` (internal connection)
- Or `.railway.app` (external connection)
- Ask Railway support which to use

---

### 3. Tables Not Created (Setup Failed)

**Error:**
```
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

**Solution:**

1. **Verify setup.php ran successfully:**
   - Visit: `https://your-site.onrender.com/setup.php`
   - Should show green checkmarks
   - If errors, read them carefully

2. **Manual Setup via SSH:**
   ```bash
   # If Render offers SSH access:
   ssh into server
   mysql -h <host> -u root -p <database> < database.sql
   ```

3. **Run SQL Queries Manually:**
   ```bash
   # Using Railway dashboard or local MySQL client:
   mysql -h <railway-host> -u root -p railway < database.sql
   ```

---

### 4. Site Too Slow / Auto-Sleep

**Normal Behavior:**
- Free tier auto-sleeps after 15 minutes of inactivity
- First request after sleep takes 30-45 seconds
- This is expected and normal

**Optimize Performance:**
1. Upgrade to Render Pro ($7/month) for instant startup
2. Use Cloudflare (free CDN) to cache assets
3. Optimize images
4. Minimize database queries

**Cloudflare Setup:**
1. Go to https://cloudflare.com
2. Add your site
3. Update DNS to Cloudflare
4. Enable caching and minification
5. Performance improves significantly

---

### 5. Session/Login Not Working

**Problem:**
- Can register but can't stay logged in
- Session lost after page refresh

**Causes:**
- Sessions stored in `/tmp` (ephemeral on Render)
- Browser cookies not working
- Session path permissions issue

**Solution:**

**Option A: Fix Session Storage (Recommended)**

Update `php/config.php`:
```php
<?php
// Set session save path for Render
if (getenv('RENDER')) {
    session_save_path('/tmp');
}
ini_set('session.gc_maxlifetime', 86400); // 24 hours
ini_set('session.cookie_lifetime', 86400);

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
```

**Option B: Use Database Sessions**

Create sessions table:
```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    data LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

Update `php/config.php`:
```php
<?php
// Use database for sessions
session_set_save_handler(
    function($id) {
        // read
    },
    function($id, $data) {
        // write
    },
    // ... other handlers
);
?>
```

---

### 6. Environment Variables Not Working

**Problem:**
```php
echo getenv('DB_HOST');  // Returns empty or false
```

**Solution:**

1. **Verify Variables Added in Render:**
   - Dashboard → Your Service → Environment
   - Should list all variables
   - Click "Save" after adding

2. **Redeploy After Adding Variables:**
   ```bash
   git push origin main  # Trigger redeploy
   # OR
   # Click "Manual Deploy" in Render Dashboard
   ```

3. **Check Environment Variables Take Effect:**
   Create `check_env.php`:
   ```php
   <?php
   echo "DB_HOST: " . getenv('DB_HOST') . "<br>";
   echo "DB_USER: " . getenv('DB_USER') . "<br>";
   echo "DB_NAME: " . getenv('DB_NAME') . "<br>";
   echo "PORT: " . getenv('PORT') . "<br>";
   echo "<pre>";
   print_r($_ENV);
   echo "</pre>";
   ?>
   ```
   Visit: `https://your-site.onrender.com/check_env.php`

---

### 7. Files Not Found (404 Errors)

**Problem:**
```
GET /css/style.css → 404 Not Found
GET /js/shop.js → 404 Not Found
```

**Causes:**
- Files not pushed to GitHub
- Incorrect file paths in HTML
- Case sensitivity in filenames

**Solution:**

1. **Verify Files on GitHub:**
   ```bash
   git status  # See uncommitted files
   git add .
   git commit -m "Add missing files"
   git push
   ```

2. **Check File Paths:**
   - HTML: `<link rel="stylesheet" href="css/style.css">`
   - Not: `<link rel="stylesheet" href="/css/style.css">`
   - Not: `<link rel="stylesheet" href="./css/style.css">`

3. **Check Case Sensitivity:**
   - Linux (Render) is case-sensitive
   - Use lowercase for folders: `css/`, `js/`, `php/`
   - Not: `CSS/`, `JS/`, `PHP/`

4. **Redeploy:**
   ```bash
   git push origin main
   ```

---

### 8. Images Not Displaying

**Problem:**
- Product images show broken image icon
- Console shows 404 for images

**Solution:**

**Option A: Use External Image Hosting**

1. **Cloudinary (Free):**
   - Go to https://cloudinary.com
   - Upload images
   - Get URLs like: `https://res.cloudinary.com/...`

2. **Imgur (Free):**
   - Go to https://imgur.com
   - Upload images
   - Get public URLs

3. **Update Database:**
   ```sql
   UPDATE products SET image_url = 'https://res.cloudinary.com/your-cloud/image/upload/v123/engine.jpg'
   WHERE id = 1;
   ```

**Option B: Local Images**

1. Create `/images/` folder
2. Upload images there
3. In database: `image_url = 'images/engine.jpg'`
4. Update `js/shop.js`:
   ```javascript
   function getCategoryEmoji(category) {
       // Fallback: show emoji + image
       return `<img src="images/${productId}.jpg" alt="${product.name}">`;
   }
   ```

---

### 9. Payment Not Processing

**Problem:**
- Form validation errors
- "Complete Payment" doesn't work
- Blank success page

**Solution:**

1. **Check Browser Console:**
   - Press F12 → Console
   - Look for JavaScript errors
   - Fix errors locally and redeploy

2. **Verify Form Inputs:**
   ```javascript
   // In checkout.js, add logging:
   console.log('Payment Method:', document.querySelector('input[name="payment_method"]:checked').value);
   console.log('Amount:', calculateTotal());
   ```

3. **Check PHP Logs:**
   - Render Logs → Look for PHP errors
   - Fix in code and redeploy

4. **Test Locally First:**
   ```bash
   php -S localhost:8000
   # Test all checkout flow locally
   ```

---

### 10. Redirect Loop / Too Many Redirects

**Error:**
```
Error: Too many redirects
```

**Causes:**
- Incorrect login redirect
- PHP header() being called multiple times
- Session issues

**Solution:**

1. **Check for Multiple session_start():**
   ```bash
   grep -r "session_start()" .
   # Should only be in config.php
   ```

2. **Check Redirects in auth.php:**
   ```php
   // Should be:
   if (...) {
       $_SESSION['user_id'] = ...;
       header('Location: ../shop.html');
       exit();  // IMPORTANT: Must exit after header!
   }
   ```

3. **Verify Shop.html Can Be Accessed:**
   - No PHP processing needed for HTML files
   - Serve directly without redirect

---

### 11. "Cannot Modify Header Information"

**Error:**
```
Warning: Cannot modify header information - headers already sent
```

**Solution:**

1. **Remove Output Before session_start():**
   ```php
   <?php
   // Must be FIRST line
   session_start();
   
   // Then other code
   ?>
   ```

2. **Remove Extra Spaces/Newlines:**
   - Check for blank lines before `<?php`
   - Check for blank lines after `?>`
   - Delete them

3. **Check for BOM (Byte Order Mark):**
   - Save file as UTF-8 without BOM
   - Some editors add BOM automatically

---

### 12. CORS / Cross-Origin Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

Add CORS headers to PHP files:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
?>
```

---

## Emergency Procedures

### Service Completely Down

1. **Check Render Status:**
   - https://status.render.com
   - Check if there's service outage

2. **Check Logs for Errors:**
   - Dashboard → Logs
   - Look for critical errors

3. **Manual Redeploy:**
   - Dashboard → Manual Deploy
   - Wait for redeploy to complete

4. **Clear Cache:**
   - If using Cloudflare, purge cache
   - Hard refresh browser (Ctrl+Shift+R)

5. **Contact Support:**
   - If still down: https://render.com/support
   - Include service ID and error details

### Database Down

1. **Check Database Service Status:**
   - Railway Dashboard → Status
   - PlanetScale Dashboard → Status

2. **Attempt Reconnection:**
   - Render Dashboard → Manual Deploy

3. **Restore from Backup:**
   - Contact database provider support
   - Restore from previous backup

### Git Push Failed

1. **Check GitHub Status:**
   - https://www.githubstatus.com

2. **Try Again:**
   ```bash
   git push origin main
   ```

3. **Force Push (Only if needed):**
   ```bash
   git push -f origin main
   ```

---

## Performance Optimization

### Speed Up Cold Starts
```
Upgrade to Paid Plan: $7/month for instant starts
```

### Cache Static Files
```
Use Cloudflare (free): Caches CSS, JS, images
```

### Optimize Database
```php
// Add indexes to frequently queried columns
ALTER TABLE products ADD INDEX idx_category (category);
ALTER TABLE orders ADD INDEX idx_user_id (user_id);
```

### Minify Assets
- Use tools to minify CSS and JS
- Reduces file size
- Faster download

---

## Testing Checklist

Before Reporting Bugs:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check browser console (F12)
- [ ] Check Render logs
- [ ] Try in incognito mode (no cache)
- [ ] Try from different device
- [ ] Test locally first
- [ ] Check database connection
- [ ] Verify environment variables

---

## When to Contact Support

**Contact Render Support if:**
- Service won't deploy after multiple attempts
- Persistent 502 errors with no clear cause
- Database connection issues (network level)
- Performance issues beyond normal

**Contact Database Provider if:**
- Cannot connect to database (verify credentials first)
- Database performance degradation
- Storage/quota issues

---

**Still having issues?**

1. Check this guide for your error
2. Check Render Docs: https://render.com/docs
3. Search error on Google/Stack Overflow
4. Contact Render Support with service ID

---

Good luck! Your CarShop will be running smoothly in no time! 🚀
