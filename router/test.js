'use strict';

import TestCtrl from '../controller/test';
import PermissionCtrl from '../controller/permission';

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
    controller: TestCtrl.throwUndefinedError
  },
  {
    method: 'get',
    path: '/no_permission',
    controller: TestCtrl.test,
    middleware: PermissionCtrl.checkNoPermission
  }
];
