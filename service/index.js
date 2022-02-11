'use strict'

const config = require('../config')
const AliOSS = require('../lib/aliyun/oss')
const { CLOUD_STORAGE_VENOR } = require('./file-object')

let aliyunOSSList =
  config.aliyun.oss.map((v) => {
    return new AliOSS(v)
  }) || []

const TokenModel = require('./token')

let MongoData, MySqlData, RedisData

!(async () => {
  MongoData = await require('../models/mongo')

  MySqlData = await require('../models/mysql')

  RedisData = await require('../models/redis')

  if (MongoData) {
    // 创建示例数据
    await TokenModel.upsert({
      name: 'funnyzak',
      token: 'helloworld',
      app: 'transfer',
      relationId: 1
    })

    await require('./file-object').upsert({
      hash: 'hello world'
    })
  }
})()

module.exports.aliyun = {
  ossList: aliyunOSSList,
  oss: aliyunOSSList[0],
  ossPick: (bucket) =>
    (aliyunOSSList || []).find((v) => v.option.bucket === bucket)
}

module.exports.MongoData = MongoData
module.exports.RedisData = RedisData
module.exports.MySqlData = MySqlData
module.exports.config = config
