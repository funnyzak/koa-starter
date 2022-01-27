# koa quick start

[![license][license-image]][repository-url]

[license-image]: https://img.shields.io/github/license/funnyzak/koa-quick-start.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/koa-quick-start

Koa2 快速开始脚手架。

---

## 目录

- [koa quick start](#koa-quick-start)
  - [目录](#目录)
  - [特点](#特点)
  - [结构](#结构)
  - [运行](#运行)
  - [参考](#参考)
  - [赞赏](#赞赏)
  - [Author](#author)
  - [License](#license)

## 特点

1. 基于 KOA2 框架
2. 集成 MongoDB 数据库
3. 集成 MySQL 数据库
4. 集成 Redis 数据库
5. 集成 joi 路由验证
6. 集成 koa-session
7. eslint、prettier 代码规范
8. ejs 模板引擎
9. 支持测试覆盖

## 结构

    ├── .vscode                                // vscode 配置
    ├── app.js                                 // app入口文件
    ├── common                                 // 公共库
    ├── config                                 // 应用配置
    ├── controller                             // 路由控制器
    ├── index.js                               // 启动文件
    ├── lib                                    // 工具库
    ├── logs                                   // 日志文件夹
    ├── middleware                             // 中间件
    ├── test                                   // 测试覆盖
    ├── models                                 // db model
    ├── public                                 // 静态资源文件夹
    ├── router                                 // 路由
    ├── schema                                 // 验证规则
    ├── service                                // 应用业务
    └── views                                  // 模板

## 运行

1. 创建 mongoDB 数据库，准备 OSS 连接密钥；
2. **config**下，进行相应配置；
3. 安装项目依赖，启动项目。

```bash
npm install

## 开发启动
npm run watch

## 生产启动
npm start

## 测试覆盖
npm run cov
```

## 参考

- [Mongodb-utils](https://github.com/mono-js/mongodb-utils)
- [Redis](http://doc.redisfans.com/)
- [IoRedis](https://docs.redis.com/latest/rs/references/client_references/client_ioredis/)
- [MongoDb](https://docs.mongodb.com/)
- [sequelizejs](https://sequelize.org/master/manual/getting-started.html)

## 赞赏

![赞赏](https://raw.githubusercontent.com/funnyzak/tts-now/master/public/_docs/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') [![Join the chat at https://gitter.im/koa-quick-start/community](https://badges.gitter.im/koa-quick-start/community.svg)](https://gitter.im/koa-quick-start/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| [funnyzak](https://yycc.me/)

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
