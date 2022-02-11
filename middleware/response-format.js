'use strict'

const logger = require('../lib/logger')
const config = require('../config')

const SysError = require('../common/sys-error')
const ErrorCode = require('../common/error-code')
const ErrorMsg = require('../common/error-msg')
const StatusCode = require('../common/status-code')
const LogType = require('../common/log-type')

const { isJSON } = require('../lib/utils')

const parseError = (ctx, err) => {
  if (err instanceof SysError) {
    logger.warn({
      type: LogType.SERVER_WARN,
      msg: err.message,
      stack: err.stack,
      base: {
        method: ctx.method,
        path: ctx.path,
        status: ctx.status
      },
      payload: ctx.reqParams
    })

    ctx.status = err.status

    // 自定义错误
    return {
      success: false,
      code: err.code || ErrorCode.UNKNOWN_ERROR,
      data: err.data || null,
      message: err.message
    }
  }

  ctx.status = ctx.status || StatusCode.BAD_REQUEST
  // 未知错误
  const responseBody = {
    success: false,
    code: ErrorCode.UNKNOWN_ERROR,
    data: null,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : ErrorMsg.UNKNOWN_ERROR
  }

  logger.error({
    type: LogType.SERVER_ERROR,
    msg: err.message,
    stack: err.stack,
    base: {
      method: ctx.method,
      path: ctx.path,
      status: ctx.status
    },
    payload: ctx.reqParams,
    response: responseBody
  })

  return responseBody
}

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()

      // 不存在的路由（忽略 HTTP 方法）
      if (ctx.status === StatusCode.NOT_FOUND) {
        throw new SysError(
          ErrorMsg.ROUTER_NOT_FOUND,
          ErrorCode.ROUTER_NOT_FOUND,
          StatusCode.NOT_FOUND
        )
      }

      const responseBody = {
        success: true,
        code: ErrorCode.OK,
        data: isJSON(ctx.body) ? JSON.parse(ctx.body) : ctx.body,
        message: null
      }

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
      })

      if (
        config.app.jsonResponseRoutePrefix.find((v) => ctx.url.indexOf(v) === 0)
      ) {
        ctx.body = responseBody
      }
    } catch (err) {
      ctx.body = parseError(ctx, err)
    }
  }
}
