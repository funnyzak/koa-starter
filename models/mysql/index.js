'use strict'

const fs = require('fs')
const path = require('path')

const { Sequelize, Op } = require('sequelize')

const config = require('../../config')
const mysql = config.db.mysql

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  Object.assign(mysql.options, {
    operatorsAliases: operatorsAliases
  })
)

let db = {}

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

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
