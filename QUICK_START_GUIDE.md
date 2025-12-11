# Quick Start Guide

Get the Smart Waste Management system up and running in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] MongoDB Atlas account (free tier works)
- [ ] Cloudinary account (free tier works)
- [ ] Git installed

## Step 1: Clone/Download Project

```bash
# If using git
git clone <repository-url>
cd smart-waste-management

# Or extract the project files to a folder
```

## Step 2: Backend Setup (5 minutes)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0)
   - Create a database user
   - Whitelist your IP (or use 0.0.0.0/0 for development)
   - Get connection string

4. **Set up Cloudinary:**
   - Go to [Cloudinary](https://cloudinary.com)
   - Sign up for free account
   - Get your credentials from dashboard

5. **Create `.env` file:**
   ```bash
   # Copy example file
   cp .env.example .env
   
   # Edit .env with your values
   ```

   Minimum required variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waste-management
   JWT_SECRET=any-random-string-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:5173
   ```

6. **Start backend:**
   ```bash
   npm run dev
   ```

   You should see: `Server running in development mode on port 5000`

## Step 3: Frontend Setup (3 minutes)

1. **Open a new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   ```

   You should see: `Local: http://localhost:5173`

## Step 4: Test the Application

1. **Open browser:** `http://localhost:5173`

2. **Register a test user:**
   - Click "Register"
   - Fill in details
   - Select role: "User"
   - Submit

3. **Create a pickup request:**
   - Allow location access when prompted
   - Fill in notes (optional)
   - Upload a photo (optional)
   - Submit

4. **Test admin features:**
   - Register a new user with role "Admin"
   - Login as admin
   - View dashboard
   - See pickup requests on map

5. **Test worker features:**
   - Register a new user with role "Worker"
   - Login as worker
   - View assigned tasks (after admin assigns)

## Common Issues & Solutions

### Backend won't start

**Error:** `MongoDB connection failed`
- **Solution:** Check your MongoDB URI in `.env`
- Make sure IP is whitelisted in MongoDB Atlas

**Error:** `Port 5000 already in use`
- **Solution:** Change PORT in `.env` to another number (e.g., 5001)

### Frontend can't connect to backend

**Error:** `Network Error` or CORS error
- **Solution:** 
  - Make sure backend is running
  - Check `VITE_API_BASE_URL` in frontend `.env`
  - Verify `FRONTEND_URL` in backend `.env` matches frontend URL

### Images not uploading

**Error:** `Image upload failed`
- **Solution:** 
  - Check Cloudinary credentials in backend `.env`
  - Verify Cloudinary account is active

### Maps not showing

**Error:** Blank map or no tiles
- **Solution:** 
  - Check browser console for errors
  - Verify Leaflet CSS is loaded
  - Check internet connection (maps need internet)

## Next Steps

1. **Read the full documentation:**
   - [PROJECT_README.md](./PROJECT_README.md) - Overview
   - [API_CONTRACT_DOCUMENTATION.md](./API_CONTRACT_DOCUMENTATION.md) - API details
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deploy to production

2. **Customize the application:**
   - Update branding/colors in `frontend/tailwind.config.js`
   - Modify API endpoints if needed
   - Add additional features

## Development Tips

1. **Use separate terminals:**
   - Terminal 1: Backend (`npm run dev`)
   - Terminal 2: Frontend (`npm run dev`)

2. **Check logs:**
   - Backend logs appear in terminal
   - Frontend errors in browser console (F12)

3. **Hot reload:**
   - Both frontend and backend support hot reload
   - Changes auto-refresh

4. **Database management:**
   - Use MongoDB Compass to view data
   - Or use MongoDB Atlas web interface

## Getting Help

- Check documentation files in project root
- Review error messages in console/logs
- Verify all environment variables are set
- Ensure all dependencies are installed

## Production Deployment

Once development is complete, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment instructions.

---

**Happy Coding! 🚀**



