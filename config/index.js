'use strict'

const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const logger = require('../lib/logger')
const { createDirsSync } = require('../lib/utils')
const LogType = require('../common/log-type')

let config = require('./config-default')

// load 指定环境配置
const env = process.env.NODE_ENV

if (env) {
  try {
    const customConfigPath = path.join(__dirname, `config-${env}.js`)
    const defaultConfigPath = path.join(__dirname, `config-default.js`)

    if (!fs.existsSync(customConfigPath)) {
      fs.copyFileSync(defaultConfigPath, customConfigPath)
    }

    let envConfig = require(customConfigPath)
    config = _.merge(config, envConfig)
  } catch (e) {
    logger.error({
      type: LogType.CONFIG_ERROR,
      msg: e.message,
      stack: e.stack
    })
  }
}

// 上传文件夹创建
createDirsSync([config.app.upload.tmpDir, config.app.upload.saveDir])

module.exports = config
