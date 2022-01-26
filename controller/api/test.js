'use strict'

module.exports = {
  /**
   * 第一个测试
   * @param {*} ctx
   */
  async test(ctx) {
    ctx.body = '正常测试 OK'
  },

  /**
   * 抛出异常的测试
   * @param {*} ctx
   */
  async throwUndefinedError(ctx) {
    ctx.body = xxxx
  }
}
