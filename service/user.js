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
    try {
      return await MySqlData.User.findOne({
        where: {
          userName
        }
      })
    } catch (err) {
      throw new SysError(
        ErrorMsg.USER_NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
        StatusCode.BAD_REQUEST
      )
    }
  }
}
