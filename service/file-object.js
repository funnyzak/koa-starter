'use strict'

const _ = require('lodash')
const { v4 } = require('uuid')
const MongoData = require('../models/mongo')

const collectionName = 'file-object'

class FileObject {
  constructor() {}
  /**
   *
   * @returns 获取集合对象
   */
  async collection(callback) {
    return await MongoData.collection(collectionName, callback)
  }

  /**
   * 根据md5 创建或更新一个文件对象
   * @returns 文件对象
   */
  async upsert(one = { md5: 'default' }) {
    return new Promise((resolve, reject) => {
      this.collection(async (coln) => {
        await coln.utils.upsert(
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
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = new FileObject()

// import FileObject = require('./file-object')

// const fileObject = await FileObject()
// logger.info({
//   msg: 'create mongo demo data.',
//   data: await fileObject.utils.create({
//     name: 'hello world',
//     path: '/abc/1.jpg',
//     md5: 'kehdkweisdsjsdie',
//     size: 2048
//   })
// })
