import path from 'path';
import favicon from 'koa-favicon';
import serve from 'koa-static';
import json from 'koa-json';
import views from 'koa-views';
import koaBody from 'koa-body';
import session from 'koa-session';

import router from '../router';
import logger from '../lib/logger';
import config from '../config';

import requestTime from './response-time';
import responseFormat from './response-format';
// import session from './session'

import SysError from '../common/sys-error';
import ErrorCode from '../common/error-code';
import ErrorMsg from '../common/error-msg';
import StatusCode from '../common/status-code';
import LogType from '../common/log-type';

export default (app) => {
  app.on('error', (err, ctx) => {
    logger.error({
      type: LogType.SERVER_ERROR,
      msg: err.message
    });

    ctx.body = {};
  });

  if (config.koaSession.config.signed) {
    app.keys = config.koaSession.keys;
  }

  app
    // response time
    .use(requestTime({ hrtime: true }))
    // response format
    .use(responseFormat())
    .use(session(config.koaSession.config, app))
    // body parse
    .use(
      koaBody(
        Object.assign(
          {
            onError: (err) => {
              if (err.status === StatusCode.REQUEST_ENTITY_TOO_LARGE) {
                throw new SysError(
                  ErrorMsg.REQUEST_ENTITY_TOO_LARGE,
                  ErrorCode.REQUEST_ENTITY_TOO_LARGE,
                  err.status
                );
              } else {
                throw new SysError(
                  ErrorMsg.UNKNOWN_ERROR,
                  ErrorCode.UNKNOWN_ERROR,
                  StatusCode.BAD_REQUEST
                );
              }
            }
          },
          config.koaBody
        )
      )
    )
    // serve static
    .use(
      serve(path.join(__dirname, '../public'), {
        maxage: 5000
      })
    )
    // favicon
    .use(favicon(path.join(__dirname, '../public/favicon.ico')))
    // json pretter
    .use(json())
    // ejs engine
    .use(views(path.join(__dirname, '../views/ejs'), { extension: 'ejs' }))
    // use router
    .use(router.routes())
    // controller 未传入 next，路由匹配默认不会调用 allowedMethods
    .use(
      router.allowedMethods({
        throw: true,
        // 不支持此 HTTP 方法
        notImplemented: () => {
          return new SysError(
            ErrorMsg.ROUTER_NOT_FOUND,
            ErrorCode.ROUTER_NOT_FOUND,
            StatusCode.NOT_FOUND
          );
        },
        // 路由存在，无对应方法
        methodNotAllowed: () => {
          return new SysError(
            ErrorMsg.METHOD_NOT_ALLOWED,
            ErrorCode.ROUTER_NOT_FOUND,
            StatusCode.METHOD_NOT_ALLOWED
          );
        }
      })
    );
};
