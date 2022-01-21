'use strict';

import path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

//
// Logging levels
//
const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow'
  }
};

const createDayTransport = (preName, level = 'info') => {
  return new winston.transports.DailyRotateFile({
    filename: `${preName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    dirname: path.join(process.cwd(), 'logs'),
    maxSize: '20m',
    utc: false,
    maxFiles: '14d',
    level
  });
};

export const createLogger = (name) => {
  let _logger = new winston.createLogger({
    level: 'info',
    levels: config.levels,
    format: winston.format.combine(
      winston.format.json(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      })
    ),
    defaultMeta: { name },
    transports: [
      createDayTransport('info', 'info'),
      createDayTransport('warn', 'warn'),
      createDayTransport('err', 'error')
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    _logger.add(
      new winston.transports.Console({
        format: winston.format.json()
      })
    );
  }

  _logger.info(`${name} 日志服务已启动。`);
  return _logger;
};

const logger = createLogger('main');

export default logger;
