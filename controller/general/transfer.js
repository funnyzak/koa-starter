'use strict'

const fs = require('fs')
const path = require('path')
const dtime = require('time-formater')
const { v4 } = require('uuid')

const config = require('../../config')
const StatusCode = require('../../common/status-code')
const ErrorMsg = require('../../common/error-msg')
const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')
const { parseRequestFiles, createDirsSync } = require('../../lib/utils')
const { aliyun } = require('../../service')

/**
 * 保存请求的文件到本地
 * @param {*} ctx
 * @returns
 */
function saveRequestFiles(ctx) {
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

function saveRequestFilesToOSS(ctx) {
  return Promise.all(
    parseRequestFiles(ctx).map(async (v) => {
      const _key = `${config.app.upload.cloudPathPrefix}/${v4()}_${v.name}`
      await aliyun.ossList[0].put(v.path, _key)
      return {
        name: v.name,
        mime: v.type,
        hash: v.hash,
        size: v.size,
        url: `${aliyun.ossList[0].option.domain}/${_key}`
      }
    })
  )
}

module.exports = {
  /**
   * localfile upload
   *
   * @param ctx
   */
  localUpload: async (ctx) => {
    if (!ctx.request.files) {
      throw new SysError(ErrorMsg.NO_REQUEST_FILES, ErrorCode.INVALID_PARAM)
    }

    // console.log(ctx.request.body)
    ctx.body = await saveRequestFiles(ctx)
  },
  ossUpload: async (ctx) => {
    if (!ctx.request.files) {
      throw new SysError(ErrorMsg.NO_REQUEST_FILES, ErrorCode.INVALID_PARAM)
    }

    // console.log(ctx.request.body)
    ctx.body = await saveRequestFilesToOSS(ctx)
  }
}
