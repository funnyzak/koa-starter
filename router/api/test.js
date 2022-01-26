'use strict'

const TestCtrl = require('../../controller/api/test')
const PermissionCtrl = require('../../controller/api/permission')

module.exports = [
  {
    method: 'get',
    path: '/test',
    controller: TestCtrl.test,
    middleware: []
  },
  {
    method: 'get',
    path: '/throw_undefined_error',
    controller: TestCtrl.throwUndefinedError,
    middleware: async (ctx, next) => {
      ctx.set('hello', 'world')
      await next()
    }
  },
  {
    method: 'get',
    path: '/no_permission',
    controller: TestCtrl.test,
    middleware: PermissionCtrl.checkNoPermission
  }
]
