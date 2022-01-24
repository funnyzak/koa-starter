'use strict';

import OSS from 'ali-oss';
import fs from 'fs';
import { v4 as udidv4 } from 'uuid';

export default class AliYunOss {
  constructor(option) {
    const { region, accessKeyId, accessKeySecret, bucket } = option;

    this.option = option;
    this.client = new OSS({
      region: region,
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      bucket: bucket
    });

    this.getBucketList = this.getBucketList.bind(this);
    this.getFileList = this.getFileList.bind(this);
    this.put = this.put.bind(this);
  }

  /**
   * 查看Bucket列表
   *
   * @returns  返回bucket信息
   * @memberof AliYunOss
   */
  getBucketList() {
    let buckets = this.client.listBuckets();
    return buckets;
  }

  /**
   * 获取bucket文件列表
   *
   * @param {number} [count=20]
   * @param {string} [prefix='']
   * @returns 返回文件列表
   * @memberof AliYunOss
   */
  getFileList(count = 20, prefix = '') {
    return this.client.list({
      'max-keys': count || 10,
      'prefix': prefix || ''
    });
  }

  /**
   *
   *
   * @param {any} filePath  文件路径
   * @param {any} [objectKey=udidv4()] 保存后的文件key
   * @returns
   * @memberof AliYunOss
   */
  put(filePath, objectKey = udidv4(), opts = {}) {
    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在');
    }
    // this.client.useBucket(bucketName)
    return this.client.put(objectKey, filePath, opts);
  }

  /**
   * 删除一个文件
   *
   * @param {any} objectKey
   * @returns
   * @memberof AliYunOss
   */
  del(objectKey) {
    return this.client.delete(objectKey);
  }
}