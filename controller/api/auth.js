/*
 * 登录校验部分
 */

'use strict'

const ErrorMsg = require('../../common/error-msg')
const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')

module.exports = {
  /**
   * @param ctx {import('koa').Context}
   */
  login: async (ctx) => {
    const { name } = ctx.reqParams.body

    const user = {
      name
    }

    ctx.session.user = user

    ctx.body = user
  },

  /**
   * 通过会话来获取用户信息
   */
  checkLogin: async (ctx) => {
    if (!ctx.session.user) {
      throw new SysError(ErrorMsg.NEED_LOGIN, ErrorCode.NEED_LOGIN)
    }

    ctx.body = ctx.session.user
  },

  /**
   * 退出登录
   */
  logout: async (ctx) => {
    ctx.session = null

    ctx.body = {}
  }
}
