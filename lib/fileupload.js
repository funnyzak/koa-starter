'use strict'

const fs = require('fs')
const path = require('path')

const formidable = require('formidable')

const _ = require('lodash')
const dtime = require('time-formater')
const { v4: udidv4 } = require('uuid')
const utils = require('./utils')
const logger = require('./logger')

const StatusCode = require('../common/status-code')
const LogType = require('../common/log-type')
const ErrorCode = require('../common/error-code')
const SysError = require('../common/sys-error')

class FileUpload {
  constructor(opts = {}) {
    this.opts = _.merge(
      {
        // 虚拟路径
        virtualPath: 'http://localhost/upload',

        // 目标文件夹
        saveDir: path.join(__dirname, '../public/upload/tmp'),
        //临时文件夹名称
        tmpDir: path.join(__dirname, '../public/upload'),
        //是否保留扩展名
        keepExtensions: true,

        // 文件限制
        limit: {
          mimeType: ['text', 'audio', 'video', 'application'],
          maxSize: 10 * 1024 * 1024 // 10M
        },
        // formidable options, sess: https://github.com/node-formidable/
        formidable: {}
      },
      opts
    )
  }

  upload(req, uploadOpts = {}) {
    const { savePrefix } = uploadOpts

    return new Promise(async (resolve, reject) => {
      if (
        Number.parseInt(req.headers['content-length']) > this.opts.limit.maxSize
      ) {
        const errorMsg = `文件大小超过${this.opts.limit.maxSize / 1024 / 1024}M`
        logger.error({
          type: LogType.RUN_INFO,
          msg: errorMsg
        })
        return reject(
          new SysError(
            errorMsg,
            ErrorCode.FILE_TOO_LARGE,
            StatusCode.BAD_REQUEST
          )
        )
      }

      // 创建上传文件夹
      await utils.createDirsSync([this.opts.saveDir, this.opts.tmpDir])

      let form = formidable(
        _.merge(this.opts.formidable, {
          uploadDir: this.opts.tmpDir,
          maxFileSize: this.opts.limit.maxSize,
          keepExtensions: this.opts.keepExtensions,
          encoding: 'utf-8',
          hashAlgorithm: 'md5',
          allowEmptyFiles: false
        })
      )

      let postField = {}
      let [successFiles, failFiles] = [[], []]

      form
        .on('error', (error) => {
          logger.error({
            desc: '文件上传遇到错误',
            type: LogType.RUN_INFO,
            msg: error.message,
            stack: error.stack
          })
        })
        .on('end', () => {
          return resolve({
            success: successFiles,
            fail: failFiles,
            field: postField
          })
        })
        .on('fileBegin', (field, file) => {
          logger.info({
            type: LogType.RUN_INFO,
            action: `收到二进制文件 ${file.name}`,
            file: file
          })

          if (!this.opts.limit.mimeType.includes(file.type)) {
            form.emit('error', new Error(`文件类型不支持: ${file.type}`))
            failFiles.push({
              name: file.name,
              originInfo: file,
              error: '不允许的文件类型'
            })
          }
        })
        .on('field', function (field, value) {
          //有文件上传时 enctype="multipart/form-data"
          if (form.type == 'multipart') {
            if (field in postField) {
              if (!Array.isArray(postField[field])) {
                postField[field] = [postField[field]]
              }
              postField[field].push(value)
              return
            }
          }
          postField[field] = value
        })
        .on('file', async (field, file) => {
          if (!this.opts.limit.mimeType.includes(file.type)) {
            await fs.rmSync(file.path)
            return
          }

          const suffix = path.extname(file.name)
          const savePathName =
            (savePrefix && savePrefix.trim() !== ''
              ? `${savePrefix.trim()}/`
              : '') + `${dtime().format('YYYYMMDD')}`
          const saveName = `${udidv4()}${suffix}`
          const fileSaveDirPath = path.join(this.opts.saveDir, savePathName)
          const filePath = path.join(fileSaveDirPath, saveName)

          await utils.createDirsSync([fileSaveDirPath])

          await fs.renameSync(file.path, filePath)

          successFiles.push({
            name: saveName,
            hash: file.hash,
            path: filePath,
            mtime: file.mtme,
            url: `${this.opts.virtualPath}/${savePathName}/${saveName}`,
            type: file.type,
            suffix: suffix,
            size: file.size,
            originInfo: file
          })
        })
        .on('progress', (bytesReceived, bytesExpected) => {
          const progressInfo = {
            value: bytesReceived,
            total: bytesExpected
          }
        })
        .parse(req)
    })
  }
}

export default FileUpload
