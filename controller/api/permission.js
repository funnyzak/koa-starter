'use strict'

const StatusCode = require('../../common/status-code')
const ErrorMsg = require('../../common/error-msg')
const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')

/**
 * 这里只是作为路由 permissions 的一个示例
 */
module.exports = {
  /**
   * 没有权限
   * @param {*} ctx
   */
  async checkNoPermission(ctx) {
    throw new SysError(
      ErrorMsg.NO_PERMISSION,
      ErrorCode.NEED_LOGIN,
      StatusCode.FORBIDDEN
    )
  }
}
