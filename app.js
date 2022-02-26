'use strict'

const Koa = require('koa')
const config = require('./config')
const logger = require('./lib/logger')
const LogType = require('./common/log-type')

// 核心服务初始化
require('./service')

let app = new Koa()

// session 会引入 app.js
module.exports = app

// 初始化中间件
require('./middleware')(app)

// 优先从环境变量启动端口
const listenPort = process.env.PORT || config.app.port

const server = app.listen(listenPort, '0.0.0.0', () => {
  logger.info({
    type: LogType.INIT,
    msg: `Server listening on port: ${server.address().port}, env: ${process.env.NODE_ENV}.`
  })
})
