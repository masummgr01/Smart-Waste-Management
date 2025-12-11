# Smart Waste Management System

A comprehensive waste management system with real-time tracking, route optimization, and multi-role support.

## 🌐 Live Demo

Visit the live application: [https://masummgr01.github.io/Smart-Waste-Management/](https://masummgr01.github.io/Smart-Waste-Management/)

## 📋 Features

- **User Management**: Registration and authentication for Users, Workers, and Admins
- **Pickup Requests**: Users can request waste pickups with location and image uploads
- **Real-time Tracking**: WebSocket-based real-time updates for pickup status
- **Route Optimization**: AI-powered route optimization for workers
- **Admin Dashboard**: Analytics, map visualization, and management tools
- **Worker Dashboard**: Task management and navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/masummgr01/Smart-Waste-Management.git
cd Smart-Waste-Management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create `.env` file in `backend/` directory
   - Add your MongoDB connection string, JWT secret, and Cloudinary credentials

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```
Smart-Waste-Management/
├── backend/          # Node.js/Express backend
├── frontend/         # React/Vite frontend
└── docs/            # Documentation files
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Leaflet (Maps)
- Socket.io Client
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Cloudinary (Image Storage)

## 📝 Documentation

- [API Documentation](./API_CONTRACT_DOCUMENTATION.md)
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Start Guide](./QUICK_START_GUIDE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

