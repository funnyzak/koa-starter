'use strict'

const AuthCtrl = require('../../controller/api/auth')
const session = require('../../middleware/session')

module.exports = [
  {
    method: 'post',
    path: '/auth/login',
    controller: AuthCtrl.login,
    middleware: session
  },
  {
    method: 'post',
    path: '/auth/check_login',
    controller: AuthCtrl.checkLogin,
    middleware: session
  },
  {
    method: 'delete',
    path: '/auth/logout',
    controller: AuthCtrl.logout,
    middleware: session
  }
]
