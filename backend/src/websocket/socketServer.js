const { Server } = require('socket.io');
const { logger } = require('../config/logger');

let io = null;

function initSocketServer(server, corsOrigin) {
  io = new Server(server, {
    cors: {
      origin: corsOrigin || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`WebSocket Client Connected: ${socket.id}`);

    socket.on('subscribeDashboard', () => {
      socket.join('dashboard');
      logger.info(`Socket ${socket.id} subscribed to dashboard stream`);
    });

    socket.on('subscribeAlerts', () => {
      socket.join('alerts');
      logger.info(`Socket ${socket.id} subscribed to alerts stream`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getSocketIO() {
  return io;
}

function emitEvent(event, data, room = 'dashboard') {
  if (io) {
    io.to(room).emit(event, data);
  }
}

module.exports = {
  initSocketServer,
  getSocketIO,
  emitEvent,
};
