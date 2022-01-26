'use strict'

const config = require('../config/config-development')
const AliOSS = require('../lib/aliyun/oss')
const MongoDbUtils = require('../lib/db/mongo')
const logger = require('../lib/logger')

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v)
})

let mongoDB = new MongoDbUtils(config.db.mongoDb)

!(() => {
  if (mongoDB.ping()) {
    logger.info(`MongoDB ${mongoDB.opts.db} is ok.`)
  }
})()

module.exports.aliyun = {
  ossList: aliyunOSSList
}

module.exports.db = {
  mongoDB
}

module.exports = {
  config
}
