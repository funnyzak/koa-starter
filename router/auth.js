'use strict'

const AuthCtrl = require('../controller/auth')

module.exports = [
  {
    method: 'post',
    path: '/auth/login',
    controller: AuthCtrl.login,
    middleware: []
  },
  {
    method: 'post',
    path: '/auth/check_login',
    controller: AuthCtrl.checkLogin,
    middleware: []
  },
  {
    method: 'delete',
    path: '/auth/logout',
    controller: AuthCtrl.logout,
    middleware: []
  }
]
