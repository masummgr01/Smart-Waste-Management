# Deployment Guide

This guide covers deploying the Smart Waste Management system to production.

## Prerequisites

- MongoDB Atlas account
- Cloudinary account
- Google Maps API key (optional, for route optimization)
- Vercel account (for frontend)
- Render/Railway/Heroku account (for backend)

---

## Backend Deployment (Render/Railway/Heroku)

### Option 1: Render

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key (optional)
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy on every push to main branch

### Option 2: Railway

1. **Create New Project**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Service**
   - Select your repository
   - Set root directory to `backend`
   - Railway will auto-detect Node.js

3. **Set Environment Variables**
   - Add all variables from the list above in Railway dashboard

4. **Deploy**
   - Railway will automatically deploy

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`

3. **Configure Build Settings**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push

---

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0)

2. **Configure Network Access**
   - Add IP address: `0.0.0.0/0` (allow all IPs for production)
   - Or add specific IPs for better security

3. **Create Database User**
   - Go to "Database Access"
   - Create a user with read/write permissions

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Copy connection string
   - Replace `<password>` with your database user password

---

## Cloudinary Setup

1. **Create Account**
   - Go to [Cloudinary](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials**
   - Go to Dashboard
   - Copy:
     - Cloud Name
     - API Key
     - API Secret

3. **Configure Upload Presets** (optional)
   - Go to Settings → Upload
   - Create upload preset for waste management images

---

## Google Maps API Setup (Optional)

1. **Create Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project

2. **Enable APIs**
   - Enable "Maps JavaScript API"
   - Enable "Directions API"

3. **Create API Key**
   - Go to "Credentials"
   - Create API Key
   - Restrict key to your domains (recommended)

---

## Post-Deployment Checklist

- [ ] Backend is accessible and health endpoint returns 200
- [ ] Frontend can connect to backend API
- [ ] Socket.IO connection works
- [ ] User registration/login works
- [ ] Image uploads work (Cloudinary)
- [ ] Maps display correctly
- [ ] Real-time updates work
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] MongoDB connection is secure
- [ ] JWT tokens are working

---

## Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs for specific error messages

**Problem:** CORS errors
- Ensure `FRONTEND_URL` matches your frontend domain exactly
- Check CORS configuration in `app.js`

**Problem:** Socket.IO not connecting
- Verify `FRONTEND_URL` includes protocol (https://)
- Check Socket.IO CORS settings

### Frontend Issues

**Problem:** API calls failing
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Ensure backend is running

**Problem:** Maps not loading
- Check Leaflet CSS is imported
- Verify map container has height set
- Check browser console for errors

---

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure, random values for `JWT_SECRET`
   - Rotate API keys regularly

2. **MongoDB**
   - Use strong database passwords
   - Restrict network access to known IPs when possible
   - Enable MongoDB Atlas authentication

3. **API Keys**
   - Restrict Google Maps API key to your domains
   - Use different keys for development and production

4. **HTTPS**
   - Always use HTTPS in production
   - Vercel and Render provide HTTPS by default

---

## Scaling Considerations

1. **Database**
   - Upgrade MongoDB Atlas tier as needed
   - Add read replicas for high read traffic
   - Implement database indexing

2. **Backend**
   - Use load balancer for multiple instances
   - Implement Redis for session storage (if needed)
   - Use PM2 or similar for process management

3. **Frontend**
   - Enable CDN caching
   - Optimize images and assets
   - Use lazy loading for routes

---

## Monitoring

1. **Backend Monitoring**
   - Use Render/Railway built-in monitoring
   - Set up error tracking (Sentry, etc.)
   - Monitor API response times

2. **Database Monitoring**
   - Use MongoDB Atlas monitoring dashboard
   - Set up alerts for high CPU/memory usage

3. **Frontend Monitoring**
   - Use Vercel Analytics
   - Monitor page load times
   - Track error rates

---

## Backup Strategy

1. **Database Backups**
   - MongoDB Atlas provides automatic backups
   - Set up scheduled exports for critical data

2. **Code Backups**
   - Use Git for version control
   - Tag releases for easy rollback

---

## Support

For issues or questions:
- Check application logs
- Review error messages
- Consult documentation
- Contact support if needed



