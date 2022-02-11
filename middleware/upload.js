'use strict'

const _ = require('lodash')
const FileUpload = require('../lib/fileupload')

module.exports = (options) => {
  options = _.merge(
    {
      keepOriginName: false,
      removeTmp: true,
      isSaveDir: true
    },
    options
  )
  const upload = new FileUpload(options)

  return async (ctx, next) => {
    ctx.uploadFiles = await upload.process(ctx.req, {
      ...options,
      savePrefix:
        (ctx.token && ctx.token.app ? `${ctx.token.app}/` : '') +
        (ctx.query.prefix && ctx.query.prefix.trim() !== ''
          ? `${ctx.query.prefix.trim()}`
          : '')
    })

    await next()
  }
}
