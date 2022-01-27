'use strict'

const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const { existsSync, mkdir } = require('fs')

const logger = require('../lib/logger')
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
      msg: e.message
    })
  }
}

// 初始化上传文件夹
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
