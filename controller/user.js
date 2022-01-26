'use strict'

import UserService from '../service/user'

export default {
  /**
   * 获取用户
   * @param {*} ctx
   */
  async getUser(ctx) {
    const { userId } = ctx.reqParams.router

    ctx.body = await UserService.getUser(userId)
  }
}
