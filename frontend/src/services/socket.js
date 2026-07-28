import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(window.location.origin, {
      autoConnect: false,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
