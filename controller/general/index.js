'use strict'

module.exports = {
  /**
   * @param ctx
   */
  indexView: async (ctx) => {
    await ctx.render('index', {
      message: `Hello, ${new Date().getFullYear()}!`
    })
  },
  noFoundView: async (ctx) => {
    await ctx.render('nofound')
  }
}
