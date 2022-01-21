'use strict';

import path from 'path';
import moment from 'moment';
import winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

const infoLoggerTransport = new DailyRotateFile({
  name: 'info_log',
  filename: path.join(__dirname, 'logs/info_'),
  datePattern: 'yyyy_MM_dd.log',
  localTime: false,
  timestamp: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
  },
  prepend: false,
  maxsize: 7 * 1024 * 1024,
  eol: '\n',
  json: true,
  level: 'info'
});

const errorLoggerTransport = new DailyRotateFile({
  name: 'error_log',
  filename: path.join(__dirname, 'logs/error_'),
  datePattern: 'yyyy_MM_dd.log',
  localTime: false,
  timestamp: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
  },
  prepend: false,
  maxsize: 7 * 1024 * 1024,
  eol: '\n',
  json: true,
  level: 'error'
});

let logger = new winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'service' },
  transports: [
    new winston.transports.Console({
      leve: 'info',
      json: false
    }),
    errorLoggerTransport,
    infoLoggerTransport
  ]
});

/**new日志记录器  */
logger.newInfoLogger = function (name) {
  logger.log('info', '新日志记录器已创建，名称：', name);
  return new winston.createLogger({
    transports: [
      new winston.transports.Console({
        leve: 'info',
        json: false
      }),
      new DailyRotateFile({
        name: name + '_log',
        filename: './logs/' + name + '_',
        datePattern: 'yyyy_MM_dd.log',
        localTime: false,
        timestamp: () => {
          return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
        },
        prepend: false,
        maxsize: 7 * 1024 * 1024,
        eol: '\n',
        json: true,
        level: 'info'
      })
    ]
  });
};

// if(env === 'production'){
//     logger.remove('info_log');
// }

export default logger;

/* logger 使用
The log method provides the same string interpolation methods like util.format.

logger.log('info', 'test message %s, %s', 'first', 'second', {number: 123}, function(){});
// info: test message first, second
// meta = {number: 123}
// callback = function(){}

Each level is given a specific integer priority. The higher the priority the more important the message is considered to be, and the lower the corresponding integer priority. For example, npm logging levels are prioritized from 0 to 5 (highest to lowest):

{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

logger.log('silly', "127.0.0.1 - there's no place like home");
logger.log('debug', "127.0.0.1 - there's no place like home");
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");
logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");

*/
