'use strict'

const _ = require('lodash')
const { v4 } = require('uuid')

const MongoData = require('../models/mongo')

const collectionName = 'file-object'

class FileObject {
  constructor() {}

  /**
   *
   * @returns 集合操作
   */
  async colnSync(callback) {
    return await MongoData.colnSync(collectionName, callback)
  }

  /**
   * 根据hash 创建或更新一个文件对象
   * @returns 文件对象
   */
  async upsert(one = {}, where = {}) {
    return await this.colnSync(async (coln) => {
      return await coln.utils.upsert(
        Object.keys(where).length > 0
          ? where
          : {
              hash: one.hash
            },
        _.merge(
          {
            name: v4(),
            // 文件大小 Byte
            size: 0,
            // mime
            mime: null,
            // 后缀名
            suffix: null,

            // 文件 hash
            hash: null,
            // 本地存储路径
            savePath: null,

            // 上传来源IP
            ip: null,
            // 封面
            cover: null,
            description: null,
            // 来源
            source: null,
            // 如果是图片 宽、高
            // width: null,
            // height: null,
            // 其他信息
            ext: null,

            // 如果云存储商
            cloud: null,
            bucket: null,
            objectKey: null
          },
          one
        )
      )
    })
  }
}

module.exports = new FileObject()

/**
 * 云存储服务商类型
 */
module.exports.CLOUD_STORAGE_VENOR = {
  ALIYUN: 'oss',
  TENCENT: 'cos'
}
