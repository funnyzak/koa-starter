'use strict'

const _ = require('lodash')
const { v4 } = require('uuid')

const MongoData = require('../models/mongo')

const collectionName = 'token'

const TOKEN_TYPE = {
  TRANSFER: 'transfer'
}

class Token {
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
              token: one.token
            },
        _.merge(
          {
            name: v4(),

            // 令牌
            token: null,

            // 过期时间（毫秒）
            expire: new Date().getTime() + 3600 * 24 * 365 * 1000,

            // 所属APP
            app: TOKEN_TYPE.TRANSFER,

            // 关联业务ID
            relationId: null
          },
          one
        )
      )
    })
  }
}

module.exports = new Token()

/**
 * APP 类型
 */
module.exports.TOKEN_TYPE = TOKEN_TYPE
