'use strict'

// document=> https://sequelize.org/master/index.html
const fs = require('fs')
const path = require('path')

const { Sequelize } = require('sequelize')
const logger = require('..//logger')

class MySqlClient {
  /**
   *
   * @param {*} config mysql 数据库配置
   * @param {*} modelDir model 文件夹
   */
  constructor(config, modelDir) {
    const { database, username, password, options } = config

    this.config = config
    this.modelDir = modelDir || path.join(__dirname, '../../models/mysql')
    this.sequelize = new Sequelize(
      database,
      username,
      password,
      Object.assign(options, {})
    )

    this.instance = this.initialize()
  }

  initialize() {
    let db = {}

    try {
      //读取model 支持二级目录（二级目录名为 文件夹名.对象）
      fs.readdirSync(this.modelDir)
        .filter((file) => {
          return file.indexOf('.') !== 0 && file !== 'index.js'
        })
        .forEach((file) => {
          if (file.indexOf('.') > 0) {
            let model = require(path.join(this.modelDir, file))(this.sequelize)
            //如果表不存在，则创建表
            model.sync({
              force: false
            })
            db[model.name] = model
          } else {
            db[file] = {}
            fs.readdirSync(path.join(this.modelDir, file))
              .filter((f) => {
                return f.indexOf('.') > 0
              })
              .forEach((f) => {
                let model = require(path.join(this.modelDir, file, f))(
                  this.sequelize
                )
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
        `MySQL数据库【${
          this.config.database
        }】初始化并启动成功。数据库信息：${JSON.stringify(this.config)}`
      )
      return db
    } catch (err) {
      logger.error({
        msg: `MySQL数据库初始化失败，错误信息：${err.message}`,
        stack: err.stack
      })
      return null
    }
  }
}

module.exports = MySqlClient
