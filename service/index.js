'use strict'

const config = require('../config')
const AliOSS = require('../lib/aliyun/oss')

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v)
})

let MongoData, MySqlData, RedisData

!(async () => {
  MongoData = await require('../models/mongo')

  MySqlData = await require('../models/mysql')

  RedisData = await require('../models/redis')
})()

module.exports.aliyun = {
  ossList: aliyunOSSList,
  oss: aliyunOSSList[0]
}
module.exports.MongoData = MongoData
module.exports.RedisData = RedisData
module.exports.MySqlData = MySqlData
module.exports.config = config
