'use strict'

const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const config = require('../../config')
const utils = require('../../lib/utils')
const ErrorMsg = require('../../common/error-msg')
const LogType = require('../../common/log-type')

const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')
const { aliyun } = require('../../service')

const FileObject = require('../../service/file-object')
const { CLOUD_STORAGE_VENOR } = require('../../service/file-object')
const logger = require('../../lib/logger')

/**
 * 云存储和DB
 * @param {*} ctx
 * @returns
 */
function saveRequestFiles(ctx, opts = {}) {
  let { cloud: saveCloud, forceDB } = opts
  let requestFiles = ctx.requestFiles.success

  return new Promise(async (resolve, reject) => {
    const _finfo_cursor = await FileObject.colnSync(async (coln) => {
      return await coln.utils.find({ hash: { $in: requestFiles.map((v) => v.hash) } })
    })
    let finfo_list = []

    await _finfo_cursor.forEach((v) => {
      finfo_list.push(v)
    })

    requestFiles = await Promise.all(
      requestFiles.map(async (_file) => {
        try {
          let _finfo = finfo_list.find((v) => v.hash === _file.hash)
          let shouldSaveDB = false

          let new_finfo = {
            name: _file.originInfo.name,
            size: _file.size,
            mime: _file.type,
            suffix: _file.suffix,
            hash: _file.hash,
            savePath: _file.savePath,
            ip: ctx.ip
          }

          if (_finfo) {
            new_finfo = _.merge(_finfo, new_finfo)

            delete new_finfo.createdAt
            delete new_finfo.updatedAt
          }
          if (!_finfo || forceDB || !(await fs.existsSync(path.join(config.app.upload.saveDir, _finfo.savePath)))) {
            shouldSaveDB = true
          }

          const _saveCloud = (!_finfo || !_finfo.cloud || _finfo.cloud === null) && saveCloud
          if (_saveCloud || shouldSaveDB) {
            // 删除临时文件
            if ((await fs.existsSync(_file.tmpPath)) && !(await fs.existsSync(_file.path))) {
              await utils.createDirsSync(path.dirname(_file.path))
              await fs.renameSync(_file.tmpPath, _file.path)
            }
          }

          if (_saveCloud) {
            const _key = `${config.app.upload.cloudPathPrefix}/${_file.savePath}`
            await aliyun.oss.put(_file.path, _key)
            new_finfo.cloud = CLOUD_STORAGE_VENOR.ALIYUN
            new_finfo.bucket = aliyun.oss.option.bucket
            new_finfo.objectKey = _key
          }

          new_finfo = shouldSaveDB || _saveCloud ? await FileObject.upsert(new_finfo) : new_finfo
          new_finfo.url = _file.url
          return new_finfo
        } catch (e) {
          logger.error({ stack: e.stack, message: e.message })
          return null
        }
      })
    )

    resolve(requestFiles.filter((v) => v !== null))
  })
}

/**
 * 生成阿里云签名链接
 * @param {*} ctx
 * @returns
 */
function signatureFileObjects(fileObjects) {
  return Promise.all(
    fileObjects.map(async (v) => {
      if (!v.objectKey || v.objectKey === null || v.cloud !== CLOUD_STORAGE_VENOR.ALIYUN) return v

      const oss = aliyun.ossPick(v.bucket)
      if (!oss) return v

      const signatureUrl = await oss.signatureUrl(v.objectKey, config.app.upload.signatureExpires, {
        response: {
          'content-type': v.mime
        }
      })
      return {
        ...v,
        signatureUrl
      }
    })
  )
}

function fileObjectsResponseFormat(fileObjects) {
  return (fileObjects || []).map((v) => {
    if (v.bucket && v.cloud === CLOUD_STORAGE_VENOR.ALIYUN && aliyun.ossPick(v.bucket)) {
      v.cloudUrl = `${aliyun.ossPick(v.bucket).option.domain}/${v.objectKey}`
    }

    let retV = {}
    ;['hash', 'cover', 'mime', 'name', 'size', 'suffix', 'signatureUrl', 'url', 'cloudUrl'].forEach((name) => (retV[name] = v[name]))
    return retV
  })
}

const checkRequestFiles = (ctx) => {
  if (!ctx.requestFiles || (ctx.requestFiles.fail.length > 0 && ctx.requestFiles.success.length === 0)) {
    throw new SysError(ErrorMsg.REQUEST_FILES, ErrorCode.INVALID_PARAM)
  }
}

module.exports = {
  transfer: async (ctx) => {
    checkRequestFiles(ctx)

    let fileObjects = await saveRequestFiles(ctx, {
      cloud: ctx.query.cloud
    })

    fileObjects = ctx.query.signature ? await signatureFileObjects(fileObjects) : fileObjects

    logger.info({
      type: LogType.CONTROLLER_INFO,
      action: 'transfer files',
      data: fileObjects
    })

    ctx.body = fileObjectsResponseFormat(fileObjects)
  }
}
