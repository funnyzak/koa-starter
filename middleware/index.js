/**
 * index.js
 * Copyright(c) 2022
 *
 * @Author  leon (silenceace@gmail.com)
 */

'use strict'

const path = require('path')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const json = require('koa-json')
const views = require('koa-views')
const koaBody = require('koa-body')
const cors = require('koa-cors')

const routers = require('../router')
const logger = require('../lib/logger')
const config = require('../config')

const requestTime = require('./response-time')
const responseFormat = require('./response-format')
const requestLog = require('./request-log')

const SysError = require('../common/sys-error')
const ErrorCode = require('../common/error-code')
const ErrorMsg = require('../common/error-msg')
const StatusCode = require('../common/status-code')
const LogType = require('../common/log-type')

module.exports = (app) => {
  app.on('error', (err, ctx) => {
    logger.error({
      type: LogType.SERVER_ERROR,
      msg: err.message
    })

    ctx.body = {}
  })

  if (config.koaSession.config.signed) {
    app.keys = config.koaSession.keys
  }

  app
    // cors
    .use(cors())
    // response time
    .use(requestTime({ hrtime: true }))
    // response format
    .use(responseFormat())
    // body parse
    .use(
      koaBody(
        Object.assign(
          {
            onError: (err) => {
              if (err.status === StatusCode.REQUEST_ENTITY_TOO_LARGE) {
                throw new SysError(ErrorMsg.REQUEST_ENTITY_TOO_LARGE, ErrorCode.REQUEST_ENTITY_TOO_LARGE, err.status)
              } else {
                throw new SysError(ErrorMsg.UNKNOWN_ERROR, ErrorCode.UNKNOWN_ERROR, StatusCode.BAD_REQUEST)
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
    // request log
    .use(requestLog())
    // favicon
    .use(favicon(path.join(__dirname, '../public/favicon.ico')))
    // json pretter
    .use(json())
    // ejs engine
    .use(views(path.join(__dirname, '../views/ejs'), { extension: 'ejs' }))

  routers.forEach((router) => {
    // use router
    app
      .use(router.routes())
      // controller 未传入 next，路由匹配默认不会调用 allowedMethods
      .use(
        router.allowedMethods({
          throw: true,
          // 不支持此 HTTP 方法
          notImplemented: () => {
            return new SysError(ErrorMsg.ROUTER_NOT_FOUND, ErrorCode.ROUTER_NOT_FOUND, StatusCode.NOT_FOUND)
          },
          // 路由存在，无对应方法
          methodNotAllowed: () => {
            return new SysError(ErrorMsg.METHOD_NOT_ALLOWED, ErrorCode.ROUTER_NOT_FOUND, StatusCode.METHOD_NOT_ALLOWED)
          }
        })
      )
  })
}
