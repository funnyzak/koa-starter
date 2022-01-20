# aliyun oss transfer

基于阿里云 OSS 文件上传服务。

项目开发时，基于 **Node 15.14.0**下运行。

## 特点

1. 基于 KOA 框架
2. 数据库使用 MongoDB

## 流程

1. 通过 http put 上传文件此服务，默认地址 **http://host:port/oss/put**。
2. 上传成功后，返回临时阿里云的 Object 访问地址。

## 运行

1. 创建 mongoDB 数据库，准备 OSS 连接密钥。
2. 根目录下复制配置文件为 **config.js**，并配置。
3. 安装项目依赖，启动项目。

```bash
npm install --production

## 开发启动
npm run dev

## 生产启动
npm start
```

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
