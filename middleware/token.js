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
    // 从header中 x-token 获取 token， x-app-id 中获取APP标识
    const token_prop_name = 'x-token',
      app_prop_name = 'x-app-id',
      token_expires_prop_name = 'x-token-expires'

    const _token = ctx.headers[token_prop_name] || ctx.query[token_prop_name],
      _app = ctx.headers[app_prop_name] || ctx.query[app_prop_name]

    if (!_token || !_app) {
      throw new SysError(
        ErrorMsg.MISSING_PARAM,
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

    ctx.set(token_expires_prop_name.toUpperCase(), token_info.expire)
    ctx.set(app_prop_name.toUpperCase(), app_name)

    logger.info({
      type: LogType.RUN_INFO,
      action: 'token passed.',
      info: token_info
    })

    ctx.token = token_info

    await next()
  }
}
