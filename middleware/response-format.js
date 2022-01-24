'use strict';

import logger from '../lib/logger';

import SysError from '../common/sys-error';
import ErrorCode from '../common/error-code';
import ErrorMsg from '../common/error-msg';
import StatusCode from '../common/status-code';
import LogType from '../common/log-type';

const parseError = (ctx, err) => {
  if (err instanceof SysError) {
    logger.warn({
      type: LogType.SERVER_WARN,
      msg: err.message,
      base: {
        method: ctx.method,
        path: ctx.path,
        status: ctx.status
      },
      payload: ctx.reqParams
    });

    // 自定义错误
    return {
      success: false,
      code: err.code || ErrorCode.UNKNOWN_ERROR,
      data: err.data || null,
      message: err.message
    };
  } 
    logger.error({
      type: LogType.SERVER_ERROR,
      msg: err.message,
      base: {
        method: ctx.method,
        path: ctx.path,
        status: ctx.status
      },
      payload: ctx.reqParams
    });

    // 未知错误
    return {
      success: false,
      code: ErrorCode.UNKNOWN_ERROR,
      data: null,
      message: ErrorMsg.UNKNOWN_ERROR
    };
  
};

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();

      // 不存在的路由（忽略 HTTP 方法）
      if (ctx.status === StatusCode.NOT_FOUND) {
        throw new SysError(
          ErrorMsg.ROUTER_NOT_FOUND,
          ErrorCode.ROUTER_NOT_FOUND,
          StatusCode.NOT_FOUND
        );
      }

      const responseBody = {
        success: true,
        code: ErrorCode.OK,
        data: ctx.body,
        message: responseBody
      };

      ctx.body = response;

      logger.info({
        type: LogType.RUN_INFO,
        msg: 'request2response info',
        base: {
          method: ctx.method,
          path: ctx.path,
          status: ctx.status
        },
        payload: ctx.reqParams,
        response: responseBody
      });
    } catch (err) {
      ctx.status = err.status || StatusCode.OK;
      ctx.body = parseError(ctx, err);
    }
  };
};
