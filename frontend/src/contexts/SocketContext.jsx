import { createContext, useContext, useEffect, useState } from 'react';
import { getSocket, connectSocket } from '../services/websocket.js';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const socketInstance = connectSocket();
      setSocket(socketInstance);

      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    } else {
      setSocket(null);
    }
  }, [isAuthenticated]);

  const value = {
    socket,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};




