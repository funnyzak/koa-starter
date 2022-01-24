'use strict';

import ErrorMsg from '../common/error-msg';
import ErrorCode from '../common/error-code';
import StatusCode from '../common/status-code';
import SysError from '../common/sys-error';

/**
 * 这里只是作为路由 permissions 的一个示例
 */
export default {
  /**
   * 没有权限
   * @param {*} ctx
   */
  async checkNoPermission(ctx) {
    throw new SysError(
      ErrorMsg.NO_PERMISSION,
      ErrorCode.NEED_LOGIN,
      StatusCode.FORBIDDEN
    );
  }
};
