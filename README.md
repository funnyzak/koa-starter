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
  - [MongoUtils](#mongoutils)
    - [Methods](#methods)
      - [get](#get)
      - [create](#create)
      - [update](#update)
      - [upsert](#upsert)
      - [remove](#remove)
      - [find](#find)
  - [参考](#参考)
  - [赞赏](#赞赏)
  - [Author](#author)
  - [License](#license)

## 特点

1. 基于 KOA2 框架
2. 集成 MongoDB 数据库
3. 集成 MySQL 数据库
4. 集成 joi 路由验证
5. 集成 koa-session
6. eslint、prettier 代码规范
7. ejs 模板引擎
8. 支持测试覆盖

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

## MongoUtils

MongoDB utils overide the `collection` class by adding an `utils` object that will expose all the MongoDB utils methods:

```js
const mongoUtils = require('mongodb-utils')

const collection = mongoUtils(db.collection('users'))

// We can now access to mongodb-utils method from .utils
const user = await collection.utils.get({ username: 'terrajs' })
```

### Methods

#### get

```js
get(query = { key: value } || string || ObjectID, [fields]): Promise<doc>
```

Return a document that match the specific identifier (`_id` by default) or the query:

```js
// Get the document that match the query { _id: ObjectID('59c0de2dfe8fa448605b1d89') }
collection.utils.get('59c0de2dfe8fa448605b1d89')

// Get the document that match the query { username: 'terrajs' }
collection.utils.get({ username: 'terrajs' })

// Get the document that match the query & return only its _id
collection.utils.get({ username: 'terrajs' }, { _id: 1 })
// Get the document that match the query & return only its _id (works with array too)
collection.utils.get({ username: 'terrajs' }, ['_id'])
```

#### create

```js
create(doc: object): Promise<doc>
```

Insert a document into the collection and add `createdAt` and `updatedAt` properties:

```js
// Add a document into the collection and return the created document
const user = await collection.utils.create({ username: 'terrajs' })
```

#### update

```js
update(query = { key: value } || string || ObjectID, doc: object): Promise<doc>
```

Update a specific document and update the `updatedAt` value

```js
// Update the document that match the query { _id: ObjectID('59c0de2dfe8fa448605b1d89') } and update its username
await collection.utils.update('59c0de2dfe8fa448605b1d89', {
  username: 'terrajs2'
})

// Update the document that match the query { username: 'terrajs2' } and update its username
await collection.utils.update({ username: 'terrajs2' }, { username: 'terrajs' })
```

#### upsert

```js
upsert(query = { key: value } || string || ObjectID, doc: object): Promise<doc>
```

Update or create a document if not exist
Add the `createdAt` if document not exist

```js
// Update the document that match the query { _id: ObjectID('59c0de2dfe8fa448605b1d89') } and update its username or create it if not exist
await collection.utils.upsert('59c0de2dfe8fa448605b1d89', {
  username: 'terrajs2'
})

// Update the document that match the query { username: 'terrajs2' } and update its username OR create it if not found
await collection.utils.upsert({ username: 'terrajs2' }, { username: 'terrajs' })
```

#### remove

```js
remove(query = { key: value } || string || ObjectID): Promise<boolean>
```

Remove a document that match the specific identifier (`_id` by default) or the query:

```js
// Remove the document that match the query { _id: ObjectID('59c0de2dfe8fa448605b1d89') }
const result = collection.utils.remove('59c0de2dfe8fa448605b1d89')

// Remove the document that match the query { username: 'test' }
collection.utils.remove({ username: 'test' })
```

#### find

```js
find(query = { key: value } || string || ObjectID, [options = { fields: ..., limit: ..., offset: ..., sort: ... }]): cursor
```

The find method return a mongo cursor from a specific query and options.

Options:

- `fields`: Array of keys (`['username', ...]`) to return **OR** a MongoDB projection (`{ field1: 1, ... }`), default: `{}`
- `limit`: Nb of docs to return, no limit by default
- `offset`: Nb of docs to skpi, default: `0`
- `sort`: Sort criteria (same as `sort` method from mongo cursor), default: `{}`

```js
// Find documents that matches the query { username: new RegExp(/^test/g) }, options with { username: 1, createdAt: 1 } projection and limit at 10 elements
const users = await userCollection.mono
  .find(
    {
      username: new RegExp(/^test/g)
    },
    {
      fields: ['username', 'createdAt'],
      limit: 10
    }
  )
  .toArray()
```

## 参考

- [Mongodb-utils](https://github.com/mono-js/mongodb-utils)

## 赞赏

![赞赏](https://raw.githubusercontent.com/funnyzak/koa-quick-start/master/public/_docs/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') [![Join the chat at https://gitter.im/koa-quick-start/community](https://badges.gitter.im/koa-quick-start/community.svg)](https://gitter.im/koa-quick-start/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| [funnyzak](https://yycc.me/)

## License

MIT License © 2021 [funnyzak](https://github.com/funnyzak)
