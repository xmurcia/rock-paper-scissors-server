import IOManager from './io';
import app from "./app";
import http from 'http';
import SocketIO from 'socket.io';

/**
 * Start Express server.
 */
const server = http.createServer(app);
server.listen(app.get('port'));

/**
 * Start SocketIO.
 */
const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
};

IOManager.init(new SocketIO.Server(server, options));

