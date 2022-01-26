const { DataTypes } = require('sequelize')

let model = function (sequelize) {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        field: 'user_id',
        primaryKey: true,
        autoIncrement: true
      },
      userName: {
        type: DataTypes.STRING,
        field: 'user_name'
      },
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE
    },
    {
      tableName: 'user',
      freezeTableName: true,
      timestamps: false
    }
  )
}

module.exports = model
