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
    const MongoDbClient = require('../lib/db/mongo')
    MongoDB = new MongoDbClient(config.db.mongoDb)
    if (MongoDB.ping()) logger.info(`MongoDB ${MongoDB.opts.db} is ok.`)
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
