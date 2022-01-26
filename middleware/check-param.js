'use strict'

const Joi = require('joi')

const logger = require('../lib/logger')

const SysError = require('../common/sys-error')
const ErrorCode = require('../common/error-code')
const ErrorMsg = require('../common/error-msg')
const StatusCode = require('../common/status-code')
const LogType = require('../common/log-type')

module.exports = (params) => {
  return async function (ctx, next) {
    // 请求参数初始化
    const reqParam = {
      router: ctx.params,
      query: ctx.query,
      body: ctx.request.body,
      headers: ctx.headers
    }

    ctx.reqParams = reqParam

    if (params) {
      const schemaKeys = Object.getOwnPropertyNames(params)

      for (const keyName of schemaKeys) {
        const { error, value } = Joi.validate(
          reqParam[keyName],
          params[keyName]
        )

        if (error) {
          logger.warn({
            type: LogType.PARAM_ERROR,
            msg: error.message
          })

          throw new SysError(
            ErrorMsg.INVALID_PARAM,
            ErrorCode.INVALID_PARAM,
            StatusCode.BAD_REQUEST
          )
        }

        reqParam[keyName] = value
      }
    }

    await next()
  }
}
