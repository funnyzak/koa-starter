'use strict'

const UserCtrl = require('../controller/user')
const UserSchema = require('../schema/user')

module.exports = [
  {
    method: 'get',
    path: '/users/:username',
    controller: UserCtrl.getUser,
    checkParam: UserSchema.getUser
  }
]
