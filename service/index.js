'use strict'

const config = require('../config')
const AliOSS = require('../lib/aliyun/oss')
const logger = require('../lib/logger')

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v)
})

let MongoDB, MySqlDB

!(() => {
  if (config.app.mongodb) {
    MongoDB = require('../models/mongo')
  }
  if (config.app.mysql) {
    MySqlDB = require('../models/mysql')
  }
})()

module.exports.aliyun = {
  ossList: aliyunOSSList
}
module.exports.MongoDB = MongoDB
module.exports.MySqlDB = MySqlDB
module.exports.config = config
