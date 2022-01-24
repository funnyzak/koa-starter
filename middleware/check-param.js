'use strict';

const Joi = require('joi');

import logger from '../lib/logger';

import SysError from '../common/sys-error';
import ErrorCode from '../common/error-code';
import ErrorMsg from '../common/error-msg';
import StatusCode from '../common/status-code';
import LogType from '../common/log-type';

export default (params) => {
  return async function (ctx, next) {
    // 请求参数初始化
    const reqParam = {
      router: ctx.params,
      query: ctx.query,
      body: ctx.request.body,
      headers: ctx.headers
    };

    ctx.reqParams = reqParam;

    if (params) {
      const schemaKeys = Object.getOwnPropertyNames(params);

      for (const keyName of schemaKeys) {
        const { error, value } = Joi.validate(
          reqParam[keyName],
          params[keyName]
        );

        if (error) {
          logger.warn({
            type: LogType.PARAM_ERROR,
            msg: error.message
          });

          throw new SysError(
            ErrorMsg.INVALID_PARAM,
            ErrorCode.INVALID_PARAM,
            StatusCode.BAD_REQUEST
          );
        }

        reqParam[keyName] = value;
      }
    }

    await next();
  };
};
