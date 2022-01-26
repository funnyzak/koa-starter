'use strict'

const ErrorMsg = require('../common/error-msg')
const ErrorCode = require('../common/error-code')
const SysError = require('../common/sys-error')

const { MySqlDB } = require('./')

module.exports = {
  /**
   *
   * @param {*} userName
   * @returns user
   */
  async getUser(userName) {
    const user = await MySqlDB.user.findOne({
      where: {
        userName
      }
    })
    if (user) {
      return user
    }
    throw new SysError(ErrorMsg.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND)
  }
}
