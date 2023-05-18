# Koa2 Starter

基于 Koa2 构建的快速开始 Web 脚手架。

[![Build Status][build-status-image]][build-status]
[![license][license-image]][repository-url]
[![Sourcegraph][sg-image]][sg-url]
[![GitHub last commit][last-commit-image]][repository-url]
[![GitHub repo size][repo-size-image]][repository-url]

<!-- [![action][ci-image]][ci-url] -->
<!-- [![npm download][download-image]][download-url] -->
<!-- [![GitHub commit activity][commit-activity-image]][repository-url] -->

[build-status-image]: https://github.com/funnyzak/koa-starter/actions/workflows/test.yml/badge.svg
[sg-image]: https://img.shields.io/badge/view%20on-Sourcegraph-brightgreen.svg?style=flat-square
[sg-url]: https://sourcegraph.com/github.com/funnyzak/koa-starter
[build-status]: https://github.com/funnyzak/koa-starter/actions
[last-commit-image]: https://img.shields.io/github/last-commit/funnyzak/koa-starter?style=flat-square?style=flat-square&label=last%20commit
[license-image]: https://img.shields.io/github/license/funnyzak/koa-starter.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/koa-starter
[repo-size-image]: https://img.shields.io/github/repo-size/funnyzak/koa-starter?style=flat-square&logo=github&logoColor=white&label=size

## 目录

- [Koa2 Starter](#koa2-starter)
  - [目录](#目录)
  - [特点](#特点)
  - [结构](#结构)
  - [运行](#运行)
  - [接口](#接口)
  - [部署](#部署)
  - [参考](#参考)
  - [Contribution](#contribution)
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
11. 简单的文件存储服务（集成了阿里云）

## 结构

    ├── .vscode                                // vscode 配置
    ├── app.js                                 // app入口文件
    ├── common                                 // 公共库
    ├── config                                 // 应用配置
    ├── deploy                                 // 部署示例
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
npm ci

# 开发启动
npm run watch

# 生产启动
npm start

# 测试覆盖
npm run cov
```

## 接口

已经实现的接口，已梳理为接口文档，托管在[APIPOST](<(https://docs.apipost.cn/preview/360b0518f5e2805e/4d5c697edb4e2b6b)>)，[在线查看](https://docs.apipost.cn/preview/360b0518f5e2805e/4d5c697edb4e2b6b)。

## 部署

- [通过 Docker-Compose 完成自动化部署](https://github.com/funnyzak/koa-starter/tree/main/deploy/docker)

## 参考

- [Mongodb-utils](https://github.com/mono-js/mongodb-utils)
- [Redis](http://doc.redisfans.com/)
- [IoRedis](https://docs.redis.com/latest/rs/references/client_references/client_ioredis/)
- [MongoDb](https://docs.mongodb.com/)
- [sequelizejs](https://sequelize.org/master/manual/getting-started.html)
- [Joi](https://joi.dev/api/)

## Contribution

If you have any questions or suggestions, please feel free to open an issue or pull request.

<a href="https://github.com/funnyzak/koa-starter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=funnyzak/koa-starter" />
</a>

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
