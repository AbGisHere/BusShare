# Deployment Guide: Vercel + Railway

This guide will help you deploy the Bus-Share application with frontend on Vercel and backend on Railway.

---

## 🚀 Quick Overview

- **Frontend (React)** → Vercel
- **Backend (Node.js/Express)** → Railway
- **Database** → SQLite (hosted on Railway)

---

## 📋 Prerequisites

1. GitHub account with your code pushed to a repository
2. Vercel account (free)
3. Railway account (free tier available)

---

## 🛤️ Step 1: Deploy Backend on Railway

### 1.1 Connect Railway to GitHub

1. Go to [railway.app](https://railway.app)
2. Click "Login with GitHub"
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Bus-Share repository
5. Choose the `backend` directory as the root directory

### 1.2 Configure Railway Settings

1. **Set Environment Variables:**
   ```
   PORT=5001
   JWT_SECRET=your_super_secure_jwt_secret_here
   NODE_ENV=production
   DATABASE_URL=sqlite:./data/busshare.db
   ```

2. **Configure Build Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`

### 1.3 Add Health Check Endpoint

Add this to your backend routes (if not already present):

```typescript
// In backend/src/routes/index.ts or similar
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### 1.4 Deploy

1. Click "Deploy" 
2. Wait for deployment to complete
3. Copy your Railway URL (e.g., `https://your-app-name.railway.app`)

---

## 🌐 Step 2: Deploy Frontend on Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Login with GitHub"
3. Click "Add New..." → "Project"
4. Select your Bus-Share repository
5. Set the Root Directory to `frontend`

### 2.2 Configure Vercel Settings

1. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

2. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 2.3 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app-name.vercel.app`

---

## 🔧 Step 3: Post-Deployment Configuration

### 3.1 Update CORS Settings

In your backend, ensure CORS allows your Vercel domain:

```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

### 3.2 Test the Deployment

1. Visit your Vercel URL
2. Try registering/logging in
3. Test all features (booking, QR scanning, admin panel)

---

## 🔄 Step 4: CI/CD Setup

### Automatic Deployments

Both Vercel and Railway automatically deploy when you push to your main branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Environment-Specific Builds

- **Development**: `npm start` (local)
- **Production**: Automatic on Vercel/Railway

---

## 🐛 Common Issues & Solutions

### Issue 1: API Calls Failing

**Problem**: Frontend can't reach backend
**Solution**: 
1. Check `REACT_APP_API_URL` is correct
2. Verify CORS settings
3. Check Railway logs for errors

### Issue 2: Build Failures

**Problem**: Deployment fails during build
**Solution**:
1. Check all dependencies are in package.json
2. Verify TypeScript compilation
3. Check Railway/Vercel build logs

### Issue 3: Database Issues

**Problem**: SQLite database not persisting
**Solution**:
1. Ensure `DATABASE_URL` is set correctly
2. Use Railway's persistent storage
3. Check file permissions

---

## 📊 Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts (paid tier)

### Vercel
- View build logs and function logs
- Monitor performance with Vercel Analytics
- Set up custom domains (if needed)

---

## 🎉 You're Live!

Your Bus-Share application is now deployed:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.railway.app`

Users can now register, book rides, and use all features in production!

---

## 🔄 Updates & Maintenance

### Updating Your App

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel and Railway will automatically redeploy

### Database Backups

Railway's SQLite database persists, but consider:
1. Regular exports of your database
2. Version control for schema changes
3. Monitoring storage usage

---

## 🆘 Support

If you run into issues:
1. Check Vercel/Railway logs first
2. Verify environment variables
3. Test locally with production settings
4. Check this guide for common solutions
