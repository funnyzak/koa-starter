# koa quick start

[![license][license-image]][repository-url]

[license-image]: https://img.shields.io/github/license/funnyzak/koa-quick-start.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/koa-quick-start

Koa2 快速开始脚手架项目。

## 特点

1. 基于 KOA2 框架
2. 数据库使用 MongoDB
3. 集成 joi 路由验证
4. 集成 koa-session
5. eslint、prettier 代码规范
6. ejs 模板引擎

## 目录

    ├── .vscode                                // vscode 配置
    ├── app.js                                 // app入口文件
    ├── common                                 // 公共库
    ├── config                                 // 应用配置
    ├── controller                             // 路由控制器
    ├── index.js                               // 启动文件
    ├── lib                                    // 工具库
    ├── logs                                   // 日志文件夹
    ├── middleware                             // 中间件
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
npm run dev

## 生产启动
npm start
```

## 赞赏

![赞赏](https://raw.githubusercontent.com/funnyzak/tts-now/master/public/_docs/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') [![Join the chat at https://gitter.im/tts-now/community](https://badges.gitter.im/tts-now/community.svg)](https://gitter.im/tts-now/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| [funnyzak](https://yycc.me/)

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
