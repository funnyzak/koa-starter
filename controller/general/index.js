'use strict'

module.exports = {
  /**
   * @param ctx
   */
  indexView: async (ctx) => {
    await ctx.render('index', {
      message: 'hello, 2022!'
    })
  },
  noFoundView: async (ctx) => {
    await ctx.render('nofound')
  }
}
