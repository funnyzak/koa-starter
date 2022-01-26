const { DataTypes } = require('sequelize')

let model = function (sequelize) {
  return sequelize.define(
    'user',
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
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
