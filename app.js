'use strict'

const Koa = require('koa')
const config = require('./config/config-development')
const logger = require('./lib/logger')
const LogType = require('./common/log-type')
require('./service')

let app = new Koa()
// session 会引入 app.js
module.exports = app

const middleware = require('./middleware')
middleware(app)

const server = app.listen(config.app.port, '0.0.0.0', () => {
  logger.info({
    type: LogType.INIT,
    msg: 'Server listening on port: ' + server.address().port
  })
})
