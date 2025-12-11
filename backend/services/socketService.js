import { Server } from 'socket.io';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on user role
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const emitSocketEvent = (eventName, data) => {
  if (io) {
    // Emit to all connected clients
    io.emit(eventName, data);
    
    // Or emit to specific rooms based on event type
    switch (eventName) {
      case 'newPickupRequest':
        io.to('admin').emit(eventName, data);
        break;
      case 'pickupAssigned':
        io.emit(eventName, data); // All users need to see assignment
        break;
      case 'pickupStatusUpdated':
        io.emit(eventName, data); // All users need to see status updates
        break;
      default:
        io.emit(eventName, data);
    }
  }
};

export const getIO = () => {
  return io;
};



