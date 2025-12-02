# Quick Start: Render.com Deployment

## 5-Minute Setup

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "CarShop initial commit"
git remote add origin https://github.com/YOUR_USERNAME/carshop.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Database (Free MySQL)

1. Go to https://railway.app
2. Click **"New Project"** → **"Database"** → **"MySQL"**
3. Copy these details:
   - **Host** (domain)
   - **Port** (usually 3306)
   - **Username**
   - **Password**
   - **Database**

### Step 3: Deploy on Render

1. Go to https://render.com (sign up if needed)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub & select `carshop` repo
4. Configure:
   - **Name**: `carshop`
   - **Environment**: `PHP`
   - **Start Command**: `php -S 0.0.0.0:${PORT:-8000} -t .`
   - **Plan**: Free

### Step 4: Add Environment Variables in Render

Click **"Environment"** and add:

```
DB_HOST=your_railway_host
DB_USER=root
DB_PASS=your_railway_password
DB_NAME=your_railway_database
```

(Get these from Railway dashboard)

### Step 5: Initialize Database

Once deployed, visit:
```
https://your-site.onrender.com/setup.php
```

This runs your `database.sql` automatically.

## Your Site is Live! 🎉

Access it at: `https://your-site.onrender.com`

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| 502 Bad Gateway | Check database credentials in Environment variables |
| Database error | Verify DB_HOST includes full Railway hostname |
| Slow startup | Free tier has 15-min auto-sleep (normal) |
| Files not found | Make sure all files pushed to GitHub |

## Environment Variables Needed

```env
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASS=your_password
DB_NAME=railway
```

## Auto-Redeploy

Just push to GitHub and Render redeploys automatically:
```bash
git add .
git commit -m "Your changes"
git push
```

## Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Check Render Logs: Dashboard → Logs

---

**That's it! Your CarShop is live on Render.com 🚀**
