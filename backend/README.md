# Smart Waste Management - Backend API

Backend server for Smart Waste Management & Garbage Pickup Scheduler system.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables:
     - MongoDB Atlas connection string
     - JWT secret
     - Cloudinary credentials
     - Google Maps API key (optional)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Production Server**
   ```bash
   npm start
   ```

## API Documentation

See `API_CONTRACT_DOCUMENTATION.md` for detailed API endpoint documentation.

## Project Structure

- `config/` - Configuration files (database, cloudinary, etc.)
- `controllers/` - Request handlers
- `middlewares/` - Custom middleware (auth, error handling, uploads)
- `models/` - Mongoose schemas
- `routes/` - API route definitions
- `services/` - External service integrations
- `utils/` - Helper functions

## Features

- JWT Authentication
- Role-based access control (User, Admin, Worker)
- Real-time updates via Socket.IO
- Image upload to Cloudinary
- Route optimization
- Geospatial queries for location-based features



