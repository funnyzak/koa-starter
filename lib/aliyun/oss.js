'use strict'

const OSS = require('ali-oss')
const fs = require('fs')
const _ = require('lodash')

class AliYunOss {
  constructor(option) {
    const { region, accessKeyId, accessKeySecret, bucket } = option

    this.option = option
    this.client = new OSS({
      region: region,
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      bucket: bucket
    })
  }

  /**
   * 查看Bucket列表
   *
   * @returns  返回bucket信息
   * @memberof AliYunOss
   */
  getBucketList() {
    let buckets = this.client.listBuckets()
    return buckets
  }

  /**
   * 获取bucket文件列表
   *
   * @param {number} [count=20]
   * @param {string} [prefix='']
   * @returns 返回文件列表
   * @memberof AliYunOss
   */
  objectList(count = 20, prefix = '') {
    return this.client.list({
      'max-keys': count || 10,
      'prefix': prefix || ''
    })
  }

  /**
   *
   *
   * @param {any} filePath  文件路径
   * @param {any} [objectKey=v4()] 保存后的文件key
   * @returns
   * @memberof AliYunOss
   */
  put(filePath, objectKey, opts = {}) {
    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在')
    }
    // this.client.useBucket(bucketName)
    return this.client.put(objectKey, filePath, opts)
  }

  /**
   * 删除一个文件
   *
   * @param {any} objectKey
   * @returns
   * @memberof AliYunOss
   */
  del(objectKey) {
    return this.client.delete(objectKey)
  }

  /**
   * Create a signature url for download or upload object. When you put object with signatureUrl ,you need to pass Content-Type.Please look at the example.
   * @param {*} objectKey
   * @param {*} opts
   * @returns
   */
  signatureUrl(objectKey, expires = 600, opts = []) {
    opts = _.merge(
      {
        method: 'GET',
        expires
      },
      opts
    )
    return this.client.signatureUrl(objectKey, opts)
  }
}

module.exports = AliYunOss
