# CarShop Render Deployment Guide

## Current Deployment Status

✅ **Latest Working Commit**: `e600b23`
- Correct PHP deployment configuration for Render with proper Docker setup

## Deployment Instructions for Render

### Step 1: Verify GitHub Connection
1. Go to https://render.com/dashboard
2. Make sure your service is connected to: `https://github.com/beaty123z/car-shop`
3. Verify the branch is set to: `master`

### Step 2: Configure Environment Variables
In Render Dashboard → Your Service → Environment:

```
DB_HOST: dpg-d4n7up2li9vc73fdfolg-a.internal
DB_PORT: 5432
DB_USER: carshop_user
DB_PASS: ljuT21StR3lXXaHXA3oq1e8LHBUGtPKF
DB_NAME: car_shop_ds3n
PORT: 8000
```

### Step 3: Deploy

**Option A - Auto Deploy (Recommended)**
1. Changes pushed to GitHub automatically trigger deployment
2. No manual action needed

**Option B - Manual Deploy**
1. Go to Render Dashboard
2. Click your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Or **"Clear build cache & deploy"** to refresh

**Option C - Deploy Specific Commit**
1. Click **"Manual Deploy"** → **"Deploy a specific commit"**
2. Select commit `e600b23` by SHA
3. This disables auto-deploy temporarily

## Troubleshooting

### If deployment fails:
1. **Check logs**: View build and runtime logs in Render Dashboard
2. **Clear build cache**: Click "Clear build cache & deploy"
3. **Check environment variables**: Verify all DB credentials are correct
4. **Verify database**: Make sure PostgreSQL database tables are created

### If you make fixes:
1. Edit files locally or in GitHub web editor
2. Commit and push to master branch
3. Render automatically redeploys
4. Monitor deployment in Render Dashboard logs

## Critical Files for Deployment

- `Dockerfile` - Docker container configuration
- `deploy.sh` - Deployment script (runs on build)
- `render.yaml` - Render service configuration
- `php/config.php` - Database connection (reads environment variables)
- `.env` - Local development only (not pushed to GitHub)

## Database Setup

Your PostgreSQL database is already created on Render:
- Host: `dpg-d4n7up2li9vc73fdfolg-a.internal`
- Database: `car_shop_ds3n`

**To initialize tables**, run the SQL schema:
1. Use Render's PostgreSQL dashboard
2. Execute the SQL from `database.sql`
3. Or use a database client to import the schema

## Application URLs

Once deployed, your app will be available at:
```
https://carshop-[service-id].onrender.com
```

Check Render Dashboard for your exact URL.

## Next Steps

1. Go to Render Dashboard
2. Clear build cache
3. Click "Redeploy"
4. Monitor the deployment logs
5. Visit your live URL once deployment completes

---

**Last Updated**: December 2, 2025
**Commit**: e600b23 - Correct PHP deployment configuration for Render with proper Docker setup
