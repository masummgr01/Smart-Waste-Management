# Backend Folder Structure (Node.js + Express)

This outlines a modular and organized folder structure for the Node.js Express backend.

```
/backend
├── config
│   ├── db.js (MongoDB connection)
│   ├── cloudinary.js (Cloudinary configuration)
│   └── jwt.js (JWT secrets and options)
├── controllers
│   ├── authController.js
│   ├── userController.js
│   ├── adminController.js
│   ├── workerController.js
│   ├── pickupController.js
│   ├── dustbinController.js
│   └── iotController.js
├── middlewares
│   ├── authMiddleware.js (JWT verification, role-based access control)
│   ├── errorHandler.js
│   └── uploadMiddleware.js (Multer for image uploads before Cloudinary)
├── models
│   ├── User.js
│   ├── PickupRequest.js
│   ├── WorkerTaskLog.js
│   └── Dustbin.js
├── routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   ├── workerRoutes.js
│   ├── dustbinRoutes.js
│   └── iotRoutes.js
├── services
│   ├── googleMapsService.js (for route optimization)
│   ├── socketService.js (Socket.IO instance and emitters)
│   └── cloudinaryService.js (wrapper for Cloudinary)
├── utils
│   ├── jwt.js (token generation/verification)
│   ├── validations.js
│   ├── geocoding.js (for location processing if needed)
│   └── routeOptimizer.js
├── app.js (Express application setup, middleware, route mounting)
├── server.js (Server entry point, DB connection, Socket.IO setup, start listening)
├── .env
├── .gitignore
├── package.json
├── README.md
└── tests
    ├── unit
    └── integration
```

## Explanation of Key Directories:

*   **`config/`**: Configuration files for database, external services, and security settings.
*   **`controllers/`**: Contains the logic for handling incoming requests and sending responses. Each file corresponds to a resource or domain.
*   **`middlewares/`**: Functions that execute during the request-response cycle (e.g., authentication, error handling, file uploads).
*   **`models/`**: Defines the Mongoose schemas and models for interacting with MongoDB.
*   **`routes/`**: Defines the API endpoints and maps them to their respective controller functions.
*   **`services/`**: Encapsulates business logic that might interact with multiple models or external APIs, promoting reusability and separation of concerns (e.g., Google Maps integration, Socket.IO handling).
*   **`utils/`**: Helper functions and utilities that don't directly fit into other categories (e.g., JWT helpers, validation logic, route optimization algorithms).
*   **`app.js`**: Sets up the Express application, registers middleware, and mounts routes.
*   **`server.js`**: The main entry point that starts the server, connects to the database, and initializes the Socket.IO server.
*   **`.env`**: Environment variables (e.g., MongoDB URI, JWT Secret, Google Maps API Key).
*   **`tests/`**: Directory for unit and integration tests.
