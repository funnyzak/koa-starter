# Koa2 Starter

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![action][ci-image]][ci-url]
[![license][license-image]][repository-url]

[ci-image]: https://img.shields.io/github/workflow/status/funnyzak/koa-starter/Node.js%20CI
[ci-url]: https://github.com/funnyzak/koa-starter/actions
[license-image]: https://img.shields.io/github/license/funnyzak/koa-starter.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/koa-starter

基于 Koa2 构建的快速开始 Web 脚手架。

下一步

- [ ] 独立 multipart 上传中间件
- [x] 优化上传功能

## 目录

- [Koa2 Starter](#koa2-starter)
  - [目录](#目录)
  - [特点](#特点)
  - [结构](#结构)
  - [运行](#运行)
  - [参考](#参考)
  - [赞赏](#赞赏)
  - [Author](#author)
  - [License](#license)

## 特点

1. 基于 Koa2 的 Web 框架
2. 集成 MongoDB 数据库
3. 集成 MySQL 数据库
4. 集成 Redis 数据库
5. 集成 JOI 路由验证
6. 集成 koa-session
7. eslint、prettier 代码规范
8. ejs 模板引擎
9. 支持跨域、文件静态、多路由声明
10. 支持测试覆盖

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

1. **config**下，创建 **config-[name].js** 配置文件；
2. 安装项目依赖，启动项目。

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
- [Joi](https://joi.dev/api/)

## 赞赏

![赞赏](https://raw.githubusercontent.com/funnyzak/funnyzak/master/public/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') [![Join the chat at https://gitter.im/koa-starter/community](https://badges.gitter.im/koa-starter/community.svg)](https://gitter.im/koa-starter/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| [funnyzak](https://yycc.me/)

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
