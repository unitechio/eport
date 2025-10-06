import env from '@/config/env';

let socket: WebSocket | null = null;

export const connectSocket = (token: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`${env.websocketUrl}?token=${token}`);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
    socket = null;
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
  }
};

export const getSocket = () => socket;
