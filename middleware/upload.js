'use strict'

const _ = require('lodash')
const FileUpload = require('../lib/reqfiles')

module.exports = (options) => {
  options = _.merge(
    {
      savePrefix: undefined,
      keepOriginName: false,
      removeTmpFile: true,
      isSaveDir: true
    },
    options
  )
  const upload = new FileUpload(options)

  return async (ctx, next) => {
    let savePrefix =
      (options.savePrefix ? `${options.savePrefix}` : '') +
      (ctx.token && ctx.token.app ? `/${ctx.token.app}` : '') +
      (ctx.query.prefix && ctx.query.prefix.trim() !== '' ? `/${ctx.query.prefix.trim()}` : '')
    savePrefix = savePrefix === '' ? undefined : savePrefix.startsWith('/') ? savePrefix.substring(1) : `${savePrefix}`

    ctx.requestFiles = await upload.process(ctx.req, {
      ...options,
      savePrefix,
      keepOriginName: ctx.query.keepOriginName ? true : undefined
    })

    await next()
  }
}
