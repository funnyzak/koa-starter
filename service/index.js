'use strict';

import config from '../config';
import AliOSS from './aliyun/oss';

let aliyunOSSList = config.aliyun.oss.map((v) => {
  return new AliOSS(v);
});

export const aliyun = {
  ossList: aliyunOSSList
};

export default {};
