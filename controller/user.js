'use strict'

const UserService = require('../service/user')

module.exports = {
  /**
   * 获取用户
   * @param {*} ctx
   */
  async getUser(ctx) {
    const { userId } = ctx.reqParams.router

    ctx.body = await UserService.getUser(userId)
  }
}
