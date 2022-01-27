'use strict'

const config = require('../config')
const AliOSS = require('../lib/aliyun/oss')
const FileObject = require('./file-object')
const UserModel = require('./user')
const logger = require('../lib/logger')

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v)
})

let MongoData, MySqlData, RedisData

!(async () => {
  if (config.app.mongodb) {
    MongoData = require('../models/mongo')

    // demo data
    logger.info({
      msg: 'create mongo demo data.',
      data: await FileObject.upsert(
        {
          md5: 'kehdkweisdsjsdie'
        },
        {
          name: 'hello world',
          md5: 'kehdkweisdsjsdie',
          size: 2048
        }
      )
    })
  }
  if (config.app.mysql) {
    MySqlData = require('../models/mysql')
  }
  if (config.app.redis) {
    RedisData = require('../models/redis')
  }
})()

module.exports.aliyun = {
  ossList: aliyunOSSList
}
module.exports.mongoData = MongoData
module.exports.RedisData = RedisData
module.exports.MySqlData = MySqlData
module.exports.config = config
