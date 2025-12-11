# Smart Waste Management & Garbage Pickup Scheduler

A comprehensive MERN stack application for managing garbage pickup requests, worker assignments, and real-time tracking with optional IoT integration.

## 🚀 Features

### User Features
- Request garbage pickup with location and photo
- View pickup request status in real-time
- See nearby smart dustbin fill levels
- Track pickup history

### Admin Features
- View all pickup requests on interactive map
- Assign workers to pickup requests
- Monitor worker performance
- View analytics and reports
- Optimize routes for workers

### Worker Features
- View assigned tasks
- Navigate to pickup locations
- Update task status (in progress, completed)
- Track completion history

## 📋 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Leaflet.js** for maps
- **Socket.IO Client** for real-time updates
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB Atlas** (Mongoose)
- **Socket.IO** for WebSocket connections
- **Cloudinary** for image storage
- **JWT** for authentication
- **Google Maps API** (optional, for route optimization)

## 📁 Project Structure

```
smart-waste-management/
├── backend/
│   ├── config/          # Database, Cloudinary configs
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth, error handling, uploads
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # External services (Socket.IO, Cloudinary)
│   ├── utils/            # Helper functions
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React Context (Auth, Socket)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/        # Utilities
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx     # Entry point
│   └── public/
│
└── docs/
    ├── ARCHITECTURE_DIAGRAM.md
    ├── ER_DIAGRAM.md
    ├── API_CONTRACT_DOCUMENTATION.md
    ├── DEPLOYMENT_GUIDE.md
    └── SCALABILITY_IMPROVEMENTS.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account
- (Optional) Google Maps API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   FRONTEND_URL=http://localhost:5173
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

See [API_CONTRACT_DOCUMENTATION.md](./API_CONTRACT_DOCUMENTATION.md) for complete API documentation.

## 🗄️ Database Schema

See [ER_DIAGRAM.md](./ER_DIAGRAM.md) and [DATABASE_DESIGN_VALIDATION.md](./DATABASE_DESIGN_VALIDATION.md) for database design details.

## 🏗️ Architecture

See [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) for system architecture overview.

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📈 Scalability

See [SCALABILITY_IMPROVEMENTS.md](./SCALABILITY_IMPROVEMENTS.md) for scalability considerations and improvements.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS configuration
- Secure file uploads

## 🔄 Real-time Features

- Real-time pickup request notifications
- Live status updates
- Instant worker assignment notifications
- Real-time dustbin fill level updates

## 📱 User Roles

1. **User**: Request pickups, view status
2. **Admin**: Manage system, assign workers, view analytics
3. **Worker**: Complete assigned tasks

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📝 Development Roadmap

### Week 1
- ✅ Project setup
- ✅ Authentication
- ✅ Database models

### Week 2
- ✅ User pickup requests
- ✅ Image upload
- ✅ Map integration

### Week 3
- ✅ Admin dashboard
- ✅ Worker management
- ✅ Map view

### Week 4
- ✅ Worker dashboard
- ✅ Real-time updates

### Week 5
- ✅ Route optimization
- ✅ Analytics

### Week 6 (Optional)

### Week 7
- Testing
- Deployment
- Documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name/Team

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image storage
- Leaflet for mapping
- Socket.IO for real-time communication

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

**Built with ❤️ using MERN Stack**



