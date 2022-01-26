'use strict'

const ErrorMsg = require('../common/error-msg')
const ErrorCode = require('../common/error-code')
const SysError = require('../common/sys-error')
const StatusCode = require('../common/status-code')

const MySqlData = require('../models/mysql')

module.exports = {
  /**
   *
   * @param {*} userName
   * @returns user
   */
  async getUser(userName) {
    const user = await MySqlData.User.findOne({
      where: {
        userName
      }
    })
    if (user) {
      return user
    }
    throw new SysError(
      ErrorMsg.USER_NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
      StatusCode.BAD_REQUEST
    )
  }
}
