'use strict'

const _ = require('lodash')
const { existsSync, mkdir } = require('fs')

const logger = require('../lib/logger')
const LogType = require('../common/log-type')

let config = require('./config-default')

// load 指定环境配置
const env = process.env.NODE_ENV || 'development'

if (env) {
  try {
    let envConfig = require(`./config-${env}`)
    config = _.merge(config, envConfig)
  } catch (e) {
    logger.error({
      type: LogType.CONFIG_ERROR,
      msg: e.message
    })
  }
}

if (!existsSync(config.app.upload.tmpDir)) {
  mkdir(config.app.upload.tmpDir, { recursive: true }, (err) => {
    if (err) {
      logger.error(
        `mkdir ${config.app.upload.tmpdir} fail. error: ${JSON.stringify(err)}`
      )
    }
  })
}

module.exports = config
