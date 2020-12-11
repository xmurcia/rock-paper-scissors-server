import IOManager from './io.class';
import app from "./app";
import http from 'http';
import SocketIO from 'socket.io';

/**
 * Start Express server.
 */
const server = http.createServer(app);
server.listen(app.get('port'));

/**
 * TODO
 * Start SocketIO. Needed CORS configuration to avoid issues,
 * the origin should be included in process.ENV to be accordind to the environment
 */
const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
};

IOManager.init(new SocketIO.Server(server, options));

