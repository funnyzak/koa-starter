'use strict';

import config from '../config';
import AliOSS from '../lib/aliyun/oss';
import MongoDbUtils from '../lib/db/mongo';
import logger from '../logger';

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v);
});

let mongoDB = new MongoDbUtils(config.db.mongoDb);

!(() => {
  if (mongoDB.ping()) {
    logger.info(`MongoDB ${mongoDB.opts.db} is ok.`);
  }
})();

export const aliyun = {
  ossList: aliyunOSSList
};

export const db = {
  mongoDB
};

export default {
  config
};
