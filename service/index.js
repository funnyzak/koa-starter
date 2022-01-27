'use strict'

const config = require('../config')
const AliOSS = require('../lib/aliyun/oss')
const FileObject = require('./file-object')
const UserModel = require('./user')
const logger = require('../lib/logger')

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v)
})

let mongoData, MySqlData

!(async () => {
  if (config.app.mongodb) {
    mongoData = require('../models/mongo')

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
})()

module.exports.aliyun = {
  ossList: aliyunOSSList
}
module.exports.mongoData = mongoData
module.exports.MySqlData = MySqlData
module.exports.config = config
