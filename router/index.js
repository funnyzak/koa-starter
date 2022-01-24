'use strict';

import fs from 'fs';
import Router from 'koa-router';

import CheckParam from '../middleware/check-param';
import logger from '../lib/logger';
import config from '../config';
import LogType from '../common/log-type';

const router = new Router({ prefix: config.app.urlPrefix });

const addToRouter = (routers) => {
  routers.forEach((item) => {
    const { method } = item;

    logger.info({
      type: LogType.INIT_ROUTER,
      payload: {
        method,
        path: `${config.app.urlPrefix}${item.path}`
      }
    });

    if (item.middleware) {
      if (!Array.isArray(item.middleware)) {
        item.middleware = [item.middleware];
      }

      router[method](
        item.path,
        CheckParam(item.checkParam),
        ...item.middleware,
        item.controller
      );
    } else {
      router[method](item.path, CheckParam(item.checkParam), item.controller);
    }
  });
};

// 路由初始化
function mergeRouters() {
  const files = fs.readdirSync(__dirname);
  files.forEach((file) => {
    if (file !== 'index.js') {
      addToRouter(require(`./${file}`));
    }
  });
}

mergeRouters();

export default router;
