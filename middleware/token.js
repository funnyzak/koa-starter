'use strict'

const logger = require('../lib/logger')

const SysError = require('../common/sys-error')
const ErrorCode = require('../common/error-code')
const ErrorMsg = require('../common/error-msg')
const LogType = require('../common/log-type')

const StatusCode = require('../common/status-code')
const Token = require('../service/token')

/**
 * App令牌验证
 * @param {*} options
 * @returns
 */
module.exports = (options) => {
  // 获取令牌对应的应用
  const app_name = options && options.app

  return async (ctx, next) => {
    const _token = ctx.query._token,
      _app = ctx.query._app

    if (!_token || !_app) {
      throw new SysError(
        process.env.NODE_ENV === 'development'
          ? error.message
          : ErrorMsg.INVALID_PARAM,
        ErrorCode.INVALID_PARAM,
        StatusCode.BAD_REQUEST
      )
    }

    const token_info = await Token.colnSync(async (coln) => {
      return await coln.utils.get({
        token: _token,
        app: app_name,
        expire: {
          $gt: new Date().getTime()
        }
      })
    })

    if (!token_info || token_info === null || app_name !== _app) {
      throw new SysError(
        ErrorMsg.INVALID_TOKEN,
        ErrorCode.INVALID_TOKEN,
        StatusCode.FORBIDDEN
      )
    }

    ctx.set('X-Token-Expire', token_info.expire)
    ctx.set('X-Token-APP', app_name)

    logger.info({
      type: LogType.RUN_INFO,
      action: 'token passed.',
      info: token_info
    })

    await next()
  }
}
