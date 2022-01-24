module.exports = {
  app: {
    name: 'aliyun oss tranfer',
    host: 'http://127.0.0.1:5000', // app主页地址
    port: '2058', // 服务启动监听端口
    fileObject: {
      objectPrefix: '/transfer',
      expiration: 600 // oss 文件对象有效期，单位（秒）
    }
  },
  /**
   * 数据库配置
   */
  db: {
    /**
     * mongoDB配置
     */
    mongoDB: {
      host: '127.0.0.1',
      port: 27017,
      db: 'oss-tranfer',
      user: 'root',
      password: 'abcedfg'
    }
  },
  aliyun: {
    /**
     * 阿里云OSS配置
     */
    oss: [
      {
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret',
        endpoint: 'https://oss-cn-beijing.aliyuncs.com',
        bucket: 'abcdef',
        region: 'oss-cn-beijing',
        domain: 'http://oss-cn-beijing.aliyuncs.com'
      }
    ]
  }
};
