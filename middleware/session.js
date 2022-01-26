'use strict'

const session = require('koa-session')
const app = require('../app')
const config = require('../config')

module.exports = session(config.koaSession.config, app)
