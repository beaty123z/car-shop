# Quick Reference: Render.com Deployment Commands

## Git & GitHub Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "CarShop initial commit"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/carshop.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Future Updates

```bash
# Make your changes locally, then:
git add .
git commit -m "Description of changes"
git push origin main
# Render auto-redeploys within seconds!
```

## Database Setup (Local Testing)

```bash
# Import database schema
mysql -u root -p car_shop < database.sql

# Connect to database
mysql -u root -p car_shop

# Check tables
SHOW TABLES;

# View products
SELECT * FROM products;

# View users
SELECT * FROM users;
```

## Testing Locally

```bash
# Start PHP development server
php -S localhost:8000 -t .

# Access in browser
http://localhost:8000

# View logs in terminal
# (PHP errors will show here)
```

## Environment Variables

### Local (.env file)
```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=car_shop
PORT=8000
```

### Render Dashboard
```
Environment Variables section:
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASS=your_password
DB_NAME=railway
```

## Render Dashboard Actions

```
View Logs:
Dashboard → Select Service → Logs

Redeploy:
Dashboard → Select Service → Manual Deploy

Update Environment Variables:
Dashboard → Select Service → Environment → Save

View Metrics:
Dashboard → Select Service → Metrics
```

## Troubleshooting Quick Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Undo last commit (if not pushed)
git reset --soft HEAD~1

# Check PHP syntax
php -l index.html

# Test MySQL connection
mysql -h <host> -u root -p -e "SELECT 1"

# View folder structure
tree -L 2
# Or:
ls -R
```

## Useful URLs

```
Your Site: https://carshop.onrender.com
Setup Database: https://carshop.onrender.com/setup.php
Check Environment: https://carshop.onrender.com/check_env.php
Admin (if added): https://carshop.onrender.com/admin.php
```

## Database Backups

```bash
# Backup to file
mysqldump -h <host> -u root -p <database> > backup.sql

# Restore from backup
mysql -h <host> -u root -p <database> < backup.sql

# Backup with date
mysqldump -h <host> -u root -p <database> > backup_$(date +%Y%m%d).sql
```

## SSH to Render (if available)

```bash
# SSH into Render service (SSH on Pro tier)
ssh -i <private_key> render@<service-id>.onrender.com

# Check running processes
ps aux

# View logs from command line
tail -f /var/log/app.log

# Restart service
systemctl restart carshop
```

## Performance Testing

```bash
# Load testing with ApacheBench
ab -n 100 -c 10 https://carshop.onrender.com/

# Check response time
curl -w "@curl-format.txt" https://carshop.onrender.com/

# Monitor in real-time
watch 'curl -s https://carshop.onrender.com/setup.php | head -20'
```

## Common Error Searches

```bash
# Search for PHP errors in project
grep -r "Error\|error\|fatal" . --include="*.php"

# Find all database queries
grep -r "SELECT\|INSERT\|UPDATE\|DELETE" . --include="*.php"

# Find hardcoded localhost
grep -r "localhost" . --exclude-dir=.git

# Find all TODO comments
grep -r "TODO\|FIXME\|HACK" . --include="*.php" --include="*.js"
```

## VSCode Terminal Commands

```bash
# Open VSCode terminal
Ctrl + ` (backtick)

# Open new terminal
Ctrl + Shift + `

# Kill terminal
Ctrl + K (then kill icon appears)
```

## Git Configuration

```bash
# Configure git username
git config --global user.name "Your Name"

# Configure git email
git config --global user.email "your@email.com"

# Check configuration
git config --global --list
```

## File Permissions (Linux/Mac)

```bash
# Make file executable
chmod +x filename.php

# Make directory writable
chmod 755 images/

# Make directory writable for everyone
chmod 777 data/
```

## Useful Tools

| Tool | Purpose | URL |
|------|---------|-----|
| GitHub | Code hosting | https://github.com |
| Render | Hosting | https://render.com |
| Railway | Database hosting | https://railway.app |
| PlanetScale | MySQL hosting | https://planetscale.com |
| Cloudflare | CDN/Cache | https://cloudflare.com |
| Postman | API testing | https://postman.com |
| Vercel | Frontend hosting | https://vercel.com |
| Netlify | Frontend hosting | https://netlify.com |

## File Paths

```
Project Root: /workspace/car-shop/

Key Files:
- Front-end: *.html
- CSS: css/style.css
- JavaScript: js/*.js
- PHP Backend: php/*.php
- Database: database.sql
- Configuration: .env, .env.example
- Deployment: Procfile, render.yaml

Folders:
- /public/ → Entry point for Render
- /css/ → Stylesheets
- /js/ → JavaScript files
- /php/ → Backend PHP files
- /images/ → Product images (optional, use external hosting)
```

## Key Files to Remember

```
RENDER_QUICK_START.md - Start here! (5 min setup)
HOSTING_GUIDE.md - Detailed instructions
DEPLOYMENT_CHECKLIST.md - Complete checklist
RENDER_TROUBLESHOOTING.md - Problem solutions
README.md - Project overview
database.sql - Database schema
setup.php - Initialize database on Render
```

## Emergency Contacts

- **Render Support**: https://render.com/support
- **Railway Support**: https://help.railway.app
- **GitHub Support**: https://support.github.com
- **Stack Overflow**: https://stackoverflow.com (tag: render, php, mysql)

## Success Indicators

✅ Your deployment is successful when:

- Site loads without 502 errors
- Users can register and login
- Products display with categories
- Cart adds/removes items
- Checkout works end-to-end
- Database persists data
- Pages load < 3 seconds
- Mobile responsive works
- HTTPS working (lock icon)
- No console errors

## Quick Checklist Before Going Live

```
☐ Code pushed to GitHub
☐ Database configured in Render
☐ Environment variables set
☐ setup.php ran successfully
☐ Tested register → login → shop → checkout
☐ Images loading (or using external hosting)
☐ Mobile responsive working
☐ No console errors
☐ Payment methods working
☐ Success page displays correctly
```

---

**Save this file for quick reference during deployment and troubleshooting!**

Print or bookmark: https://raw.githubusercontent.com/YOUR_USERNAME/carshop/main/QUICK_REFERENCE.md

Happy deploying! 🚀
