/* eslint no-console: ["off"] */

/**
 * Module dependencies.
 */

import http from 'http';

import app from './app/express';
import { log } from './app/utils';

app.on('ready', () => {
  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const port = parseInt(val, 10);
    console.log(port);

    /* eslint no-console: ["off"] */
    if (Number.isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(process.env.PORT);
  if (port) {
    app.set('port', port);
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    const addr = server.address();
    console.log(addr);
    console.log(port);
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    log(`Listening on ${bind}`);
  }

  /**
   * Listen on provided port, on all network interfaces.
   */
/*
   app.use('/admin', express.static(path.resolve(__dirname, '../dist')));
   app.use('/admin/uploads/', express.static(path.resolve(__dirname, '../uploads')));*/

  server.listen(port);
  console.log(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
