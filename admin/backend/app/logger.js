import morgan from 'morgan';
import stream from 'stream';
import carrier from 'carrier';

import Log from './models/log.model';

class MongooseMorgan {
  constructor(options) {
    options = options || {};
    const format = function (tokens, req, res) {
      return JSON.stringify({
        status: tokens.status(req, res),
        method: tokens.method(req, res),
        remoteUser: tokens['remote-user'](req, res),
        remoteAddress: tokens['remote-addr'](req, res),
        url: tokens.url(req, res),
        userAgent: tokens['user-agent'](req, res),
        httpVersion: `HTTP/${tokens['http-version'](req, res)}`,
        responseTime: tokens['response-time'](req, res, 'digits'),
        referrer: tokens.referrer(req, res),
        date: tokens.date(req, res, 'iso'),
      });
    };

    const passStream = new stream.PassThrough();

    // Create stream to read from
    const lineStream = carrier.carry(passStream);

    lineStream.on('line', line => {
      const logModel = new Log(JSON.parse(line));

      logModel.save(err => {
        if (err) {
          throw err;
        }
      });
    });

    // Morgan options stream
    options.stream = passStream;

    const mongooseMorgan = morgan(format, options);
    return mongooseMorgan;
  }
}

export default MongooseMorgan;
