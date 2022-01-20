'use strict';

import config from '../config';
import AliOss from './aliyun/oss';

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOss(v);
});

module.exports.aliyun = {
  aliyunOSSList
};
