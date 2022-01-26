'use strict'

const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const CheckParam = require('../middleware/check-param')
const logger = require('../lib/logger')
const config = require('../config')
const LogType = require('../common/log-type')

const addToRouter = (router, routes) => {
  routes.forEach((route) => {
    const { method } = route

    logger.info({
      type: LogType.INIT_ROUTER,
      payload: {
        method,
        path: `${router.opts.prefix}${route.path}`
      }
    })

    if (route.middleware) {
      if (!Array.isArray(route.middleware)) {
        route.middleware = [route.middleware]
      }

      router[method](
        route.path,
        CheckParam(route.checkParam),
        ...route.middleware,
        route.controller
      )
    } else {
      router[method](route.path, CheckParam(route.checkParam), route.controller)
    }
  })
}

// 路由合并
function mergeRouters(router, apiDir) {
  const files = fs.readdirSync(path.join(__dirname, apiDir))
  files.forEach((file) => {
    addToRouter(router, require(path.join(__dirname, apiDir, file)))
  })
}

// api路由
const apiRouter = new Router({
  prefix: config.app.apiUrlPrefix,
  sensitive: true
})

mergeRouters(apiRouter, './api')

// 其他
const generalRouter = new Router({
  prefix: '',
  sensitive: true
})
mergeRouters(generalRouter, './general')

module.exports = [apiRouter, generalRouter]
