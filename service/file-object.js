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
   * 根据md5 创建或更新一个文件对象
   * @returns 文件对象
   */
  async upsert(one = { md5: 'default' }) {
    return await this.colnSync(async (coln) => {
      return await coln.utils.upsert(
        {
          md5: one.md5
        },
        _.merge(
          {
            originName: v4(),
            name: v4(),
            description: null,
            size: 0,
            contentType: null,
            suffix: null,
            cover: null,
            source: null,
            width: null,
            height: null,
            ext: null,
            md5: null,
            ip: null,
            savePath: null
          },
          one
        )
      )
    })
  }
}

module.exports = new FileObject()
