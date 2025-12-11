import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants.js';
import { getToken, getCurrentUser } from './auth.js';

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: getToken(),
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    // Join room based on user role
    if (user.role) {
      socket.emit('join-room', user.role);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};




