'use strict';

import UserCtrl from '../controller/user';
import UserSchema from '../schema/user';

module.exports = [
  {
    method: 'get',
    path: '/users/:userId',
    controller: UserCtrl.getUser,
    checkParam: UserSchema.getUser
  }
];
