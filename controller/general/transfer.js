'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const dtime = require('time-formater')
const { v4 } = require('uuid')

const config = require('../../config')
const StatusCode = require('../../common/status-code')
const ErrorMsg = require('../../common/error-msg')
const LogType = require('../../common/log-type')

const ErrorCode = require('../../common/error-code')
const SysError = require('../../common/sys-error')
const { parseRequestFiles, createDirsSync } = require('../../lib/utils')
const { aliyun } = require('../../service')

const FileObject = require('../../service/file-object')
const { CLOUD_STORAGE_VENOR } = require('../../service/file-object')
const logger = require('../../lib/logger')

/**
 * 保存请求的文件到本地
 * @param {*} ctx
 * @returns
 */
function formatReqFile(ctx) {
  return Promise.all(
    parseRequestFiles(ctx).map(async (v) => {
      return {
        name: v.name,
        size: v.size,
        hash: v.hash,
        mime: v.type,
        suffix:
          v.name.split('.').length > 1
            ? v.name.split('.')[v.name.split('.').length - 1]
            : null,
        tmpPath: v.path
      }
    })
  )
}

/**
 * 保存文件到本地、云存储和DB
 * @param {*} ctx
 * @param {*} saveCloud
 * @param {*} forceDB
 * @returns
 */
function saveRequestFiles(ctx, saveCloud = true, forceDB = false) {
  return new Promise(async (resolve, reject) => {
    let _files = await formatReqFile(ctx)

    const _finfo_cursor = await FileObject.colnSync(async (coln) => {
      return await coln.utils.find({ hash: { $in: _files.map((v) => v.hash) } })
    })
    let _finfo_list = []

    await _finfo_cursor.forEach((v) => {
      _finfo_list.push(v)
    })

    _files = await Promise.all(
      _files.map(async (_file) => {
        try {
          let _finfo = _finfo_list.find((v) => v.hash === _file.hash)
          let shouldSaveDB = false

          const _path_prefix =
            (ctx.token && ctx.token.app ? `${ctx.token.app}/` : '') +
            `${dtime().format('YYYYMMDD')}`

          const _saveName = `${new Date().getTime()}_${_file.name}`

          const _savePath = path.join(
            config.app.upload.saveDir,
            _path_prefix,
            _saveName
          )

          if (
            !_finfo ||
            forceDB ||
            !fs.existsSync(
              path.join(config.app.upload.saveDir, _finfo.savePath)
            )
          ) {
            await createDirsSync(
              path.join(config.app.upload.saveDir, _path_prefix)
            )
            await fs.copyFileSync(_file.tmpPath, _savePath)

            _file.savePath = `/${_path_prefix}/${_saveName}`
            _file.ip = ctx.ip

            shouldSaveDB = true
          }

          if (
            (!_finfo || (!_finfo.cloud && _finfo.cloud === null)) &&
            saveCloud
          ) {
            const _key = `${
              config.app.upload.cloudPathPrefix
            }/${_path_prefix}/${v4().substring(0, 7)}_${_file.name}`
            await aliyun.oss.put(_file.tmpPath, _key)
            _file.cloud = CLOUD_STORAGE_VENOR.ALIYUN
            _file.bucket = aliyun.oss.option.bucket
            _file.objectKey = _key

            shouldSaveDB = true
          }

          if (shouldSaveDB && _finfo) {
            delete _finfo.createdAt
            delete _finfo.updatedAt
          }

          // 删除临时文件
          fs.rmSync(_file.tmpPath)
          delete _file.tmpPath

          const _doc = _.merge(_finfo, _file)
          return shouldSaveDB ? await FileObject.upsert(_doc) : _doc
        } catch (e) {
          logger.error({ stack: e.stack, message: e.message })
          return null
        }
      })
    )

    resolve(_files.filter((v) => v !== null))
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
      if (
        !v.objectKey ||
        v.objectKey === null ||
        v.cloud !== CLOUD_STORAGE_VENOR.ALIYUN
      )
        return v

      const oss = aliyun.ossPick(v.bucket)
      if (!oss) return v

      const signatureUrl = await oss.signatureUrl(
        v.objectKey,
        config.app.upload.signatureExpires,
        {
          response: {
            'content-type': v.mime
          }
        }
      )
      return {
        ...v,
        signatureUrl
      }
    })
  )
}

function fileObjectsResponseFormat(fileObjects) {
  return (fileObjects || []).map((v) => {
    v.url = `${config.app.upload.virtualPath}${v.savePath}`

    if (
      v.bucket &&
      v.cloud === CLOUD_STORAGE_VENOR.ALIYUN &&
      aliyun.ossPick(v.bucket)
    ) {
      v.cloudUrl = `${aliyun.ossPick(v.bucket).option.domain}/${v.objectKey}`
    }

    let retV = {}
    ;[
      'hash',
      'cover',
      'mime',
      'name',
      'size',
      'suffix',
      'signatureUrl',
      'url',
      'cloudUrl'
    ].forEach((name) => (retV[name] = v[name]))
    return retV
  })
}

module.exports = {
  /**
   * localfile upload
   *
   * @param ctx
   */
  transfer: async (ctx) => {
    if (!ctx.request.files) {
      throw new SysError(ErrorMsg.NO_REQUEST_FILES, ErrorCode.INVALID_PARAM)
    }
    // console.log(ctx.request.body)

    let fileObjects = await saveRequestFiles(ctx, ctx.query.cloud)

    fileObjects = ctx.query.signature
      ? await signatureFileObjects(fileObjects)
      : fileObjects

    logger.info({
      type: LogType.CONTROLLER_INFO,
      action: 'transfer files',
      data: fileObjects
    })

    ctx.body = fileObjectsResponseFormat(fileObjects)
  }
}
