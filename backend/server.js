import app from './app.js';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { initializeSocket } from './services/socketService.js';

// Connect to database
connectDB();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});




