'use strict'

const fs = require('fs')
const config = require('../../config')
const StatusCode = require('../../common/status-code')
const ErrorMsg = require('../../common/error-msg')
const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')
const { parseRequestFiles, createDirsSync } = require('../../lib/utils')
const path = require('path')
const dtime = require('time-formater')

function parseLocalRequestFiles(ctx) {
  return Promise.all(
    parseRequestFiles(ctx).map(async (v) => {
      const _day = dtime().format('YYYYMMDD')
      const _saveName = `${new Date().getTime()}_${v.name}`
      const newSavePath = path.join(config.app.upload.saveDir, _day, _saveName)
      const url = [config.app.upload.virtualPath, _day, _saveName].join('/')
      await createDirsSync(path.join(config.app.upload.saveDir, _day))
      await fs.renameSync(v.path, newSavePath)

      return {
        name: v.name,
        mime: v.type,
        hash: v.hash,
        size: v.size,
        host: config.app.host,
        url
      }
    })
  )
}

module.exports = {
  /**
   * @param ctx
   */
  localUpload: async (ctx) => {
    if (!ctx.request.files) {
      throw new SysError(ErrorMsg.NO_REQUEST_FILES, ErrorCode.INVALID_PARAM)
    }

    // console.log(ctx.request.body)
    ctx.body = await parseLocalRequestFiles(ctx)
  }
}
