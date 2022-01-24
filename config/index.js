'use strict';

import _ from 'lodash';
import logger from '../lib/logger';
import LogType from '../common/log_type';

import config from './config.default';

// load 指定环境配置
const env = process.env.NODE_ENV;

if (env) {
  try {
    let envConfig = require(`./config.${env}`);
    config = _.merge(config, envConfig);
  } catch (e) {
    logger.error({
      type: LogType.CONFIG_ERROR,
      msg: e.message
    });
  }
}

export default config;
