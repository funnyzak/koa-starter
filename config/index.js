'use strict';

import _ from 'lodash';
import { existsSync, mkdir } from 'fs';

import logger from '../lib/logger';
import LogType from '../common/log-type';

import config from './config-default';

// load 指定环境配置
const env = process.env.NODE_ENV;

if (env) {
  try {
    let envConfig = require(`./config-${env}`);
    config = _.merge(config, envConfig);
  } catch (e) {
    logger.error({
      type: LogType.CONFIG_ERROR,
      msg: e.message
    });
  }
}

if (!existsSync(config.app.upload.tmpDir)) {
  mkdir(config.app.upload.tmpDir, { recursive: true }, (err) => {
    if (err) {
      logger.error(
        `mkdir ${config.app.upload.tmpdir} fail. error: ${JSON.stringify(err)}`
      );
    }
  });
}

export default config;
