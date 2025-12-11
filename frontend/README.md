# Smart Waste Management - Frontend

Frontend application for Smart Waste Management & Garbage Pickup Scheduler system built with React, Vite, and TailwindCSS.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` with your backend API URL
   - Update `VITE_SOCKET_URL` with your Socket.IO server URL

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- User Dashboard: Request pickups, view status
- Admin Dashboard: Manage pickups, assign workers, view analytics
- Worker Dashboard: View assigned tasks, update status
- Real-time updates via Socket.IO
- Interactive maps with Leaflet
- Responsive design with TailwindCSS

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components organized by role
- `src/contexts/` - React Context for auth and socket
- `src/services/` - API service functions
- `src/utils/` - Utility functions and constants




