"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("./app/express"));

var _utils = require("./app/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console: ["off"] */

/**
 * Module dependencies.
 */
_express.default.on('ready', () => {
  /**
   * Create HTTP server.
   */
  const server = _http.default.createServer(_express.default);
  /**
   * Normalize a port into a number, string, or false.
   */


  function normalizePort(val) {
    const port = parseInt(val, 10);
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
    _express.default.set('port', port);
  }
  /**
   * Event listener for HTTP server "error" event.
   */


  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`; // handle specific listen errors with friendly messages

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
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    (0, _utils.log)(`Listening on ${bind}`);
  }
  /**
   * Listen on provided port, on all network interfaces.
   */


  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});