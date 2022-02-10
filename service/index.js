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
  MongoData = require('../models/mongo')

  MySqlData = require('../models/mysql')

  RedisData = require('../models/redis')

  if (MongoData) {
    // demo data
    logger.info({
      msg: 'create mongo demo data.',
      data: await FileObject.upsert(
        {
          hash: 'kehdkweisdsjsdie'
        },
        {
          name: 'hello world',
          hash: 'kehdkweisdsjsdie',
          size: 2048
        }
      )
    })
  }
})()

module.exports.aliyun = {
  ossList: aliyunOSSList,
  oss: aliyunOSSList[0]
}
module.exports.MongoData = MongoData
module.exports.RedisData = RedisData
module.exports.MySqlData = MySqlData
module.exports.config = config
