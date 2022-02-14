'use strict'

const logger = require('../lib/logger')

const LogType = require('../common/log-type')

module.exports = (opts) => {
  return async function (ctx, next) {
    logger.info({
      type: LogType.CONTROLLER_INFO,
      ip: ctx.request.ip,
      method: ctx.method,
      path: ctx.path,
      msg: 'Received a new request',
      route: {
        router: ctx.params,
        query: ctx.query,
        body: ctx.request.body,
        headers: ctx.headers
      }
    })

    await next()
  }
}
