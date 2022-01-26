'use strict'

const fs = require('fs')
const path = require('path')

const { Sequelize, Op } = require('sequelize')

const config = require('../../config')
const logger = require('../../lib/logger')

const mysql = config.db.mysql

const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  Object.assign(mysql.options, {})
)

let db = {}

try {
  //读取model 支持二级目录（二级目录名为 文件夹名.对象）
  fs.readdirSync(__dirname)
    .filter(function (file) {
      return file.indexOf('.') !== 0 && file !== 'index.js'
    })
    .forEach(function (file) {
      if (file.indexOf('.') > 0) {
        let model = require(path.join(__dirname, file))(sequelize)
        //如果表不存在，则创建表
        model.sync({
          force: false
        })
        db[model.name] = model
      } else {
        db[file] = {}
        fs.readdirSync(path.join(__dirname, file))
          .filter((f) => {
            return f.indexOf('.') > 0
          })
          .forEach((f) => {
            let model = require(path.join(__dirname, file, f))(sequelize)
            //如果表不存在，则创建表
            model.sync({
              force: false
            })
            //console.log(file, model.name);
            db[file][model.name] = model
          })
      }
    })
  logger.info(
    `MySQL数据库初始化并启动成功。数据库信息：${JSON.stringify(
      config.db.mysql
    )}`
  )
} catch (err) {
  logger.error({
    msg: `MySQL数据库初始化失败，错误信息：${err.message}`,
    stack: err.stack
  })
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
