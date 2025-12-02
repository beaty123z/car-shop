# Manual Render Dashboard Configuration

Since `render.yaml` isn't automatically used by Render, follow these steps to configure your service manually:

## Step 1: Delete Current Service (if needed)
If you have an existing problematic service:
1. Go to https://render.com/dashboard
2. Find your "carshop-web" service
3. Click Settings → Delete Service
4. Confirm deletion

## Step 2: Create New Web Service

1. Go to https://render.com
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub: `beaty123z/car-shop`
5. Click "Connect"

## Step 3: Configure Service Settings

Fill in the following:

### Basic Settings
- **Name**: `carshop-web`
- **Repository**: `beaty123z/car-shop`
- **Branch**: `master`
- **Runtime**: Docker (SELECT THIS - very important!)
- **Region**: Choose your preferred region
- **Plan**: Free

### Docker Configuration
- **Dockerfile Path**: `./Dockerfile`
- **Docker Command**: Leave EMPTY (Docker will use CMD from Dockerfile)

### Build Settings
- **Build Filter**: Leave empty
- **Auto-Deploy**: ON (recommended)

## Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

| Key | Value | Scope |
|-----|-------|-------|
| `DB_HOST` | `dpg-d4n7up2li9vc73fdfolg-a.internal` | Run |
| `DB_PORT` | `5432` | Run |
| `DB_USER` | `carshop_user` | Run |
| `DB_PASS` | `ljuT21StR3lXXaHXA3oq1e8LHBUGtPKF` | Run |
| `DB_NAME` | `car_shop_ds3n` | Run |
| `PORT` | `8000` | Run |

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for build to start
3. Monitor the deployment logs
4. Once "Live" status appears, your app is running!

## Verification

Your app URL will be:
```
https://carshop-[service-id].onrender.com
```

Test the health check:
```
https://carshop-[service-id].onrender.com/
```

## If Deployment Still Fails

Check these:
1. **Dockerfile**: Verify it's valid
2. **Port**: Make sure app listens on port 8000
3. **Environment Variables**: All DB credentials must be correct
4. **Docker Build**: Check build logs for errors
5. **Runtime**: Confirm "Docker" is selected (not Node/Python/PHP)

## Auto-Redeploy on Push

Once configured:
- Any commit pushed to `master` branch automatically triggers rebuild
- Check GitHub Actions for deployment status
- Monitor Render Dashboard logs for build progress

---

**Critical**: Make sure to select **Docker** as the Runtime, not PHP or Node.js!
