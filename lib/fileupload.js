/**
 * fileupload.js
 * Copyright(c) 2022
 *
 * @Author  leon (silenceace@gmail.com)
 */

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
        // 虚拟路径，用来生成URL
        virtualPath: 'http://localhost/upload',

        // 目标文件夹
        saveDir: path.join(__dirname, '../public/upload/tmp'),
        //临时文件夹名称
        tmpDir: path.join(__dirname, '../public/upload'),
        //是否保留扩展名
        keepExtensions: true,

        // 文件限制
        limit: {
          mimeType: ['image/jpeg', 'image/png', 'image/gif'],
          // limit the amount of memory all fields together (except files) can allocate in bytes (单次最大请求文件总容量)
          maxFieldsSize: 1000 * 1024 * 1024, // 1G
          // limit the size of uploaded file (单个文件可上传最大大小)
          maxFileSize: 100 * 1024 * 1024 // 100M
        },
        // formidable options, sess: https://github.com/node-formidable/
        formidable: {}
      },
      opts
    )
  }

  bytesToSize(bytes) {
    if (bytes === 0) return '0 B'
    var k = 1024
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  }

  /**
   * 调用上传
   * @param {*} req request对象
   * @param {*} uploadOpts  上传配置
   * @returns
   */
  process(req, uploadOpts = {}) {
    uploadOpts = _.merge(
      {
        // 按原文件名保存
        keepOriginName: false,
        // 存储前缀
        savePrefix: null,
        // 删除临时文件
        removeTmp: true,
        // 保存文件到存储目录，如果不保存到存储目录，则文件名按临时文件名保存切不删除临时文件
        isSaveDir: true,
        // 上传成功的毁掉
        onSuccess: async (file) => {},
        // 删除失败的回掉
        onFail: async (file) => {}
      },
      uploadOpts
    )

    return new Promise(async (resolve, reject) => {
      const req_length =
        req.headers['content-length'] &&
        Number.parseInt(req.headers['content-length'])

      if (req_length && req_length > this.opts.limit.maxFieldsSize) {
        const errorMsg = `The total size of the upload cannot exceed ${this.bytesToSize(
          req_length
        )}.`

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
        _.merge(
          {
            encoding: 'utf-8',
            hash: 'md5',
            allowEmptyFiles: false
          },
          this.opts.formidable,
          {
            uploadDir: this.opts.tmpDir,
            maxFileSize: this.opts.limit.maxFileSize,
            maxFieldsSize: this.opts.limit.maxFieldsSize,
            keepExtensions: this.opts.keepExtensions
          }
        )
      )

      let postField = {}
      let [successFiles, failFiles] = [[], []]

      form
        .on('error', (error) => {
          if (error) {
            logger.error({
              desc: 'The upload encountered an error',
              type: LogType.RUN_INFO,
              msg: error.message,
              stack: error.stack
            })
          }
          req.resume()
        })
        .on('end', () => {
          return resolve({
            success: successFiles,
            fail: failFiles,
            field: postField
          })
        })
        .on('fileBegin', async (field, file) => {
          logger.info({
            type: LogType.RUN_INFO,
            action: `file => ${file.name} upload begin...`,
            file: file
          })

          if (!this.opts.limit.mimeType.includes(file.type)) {
            const errorMsg = `The file type ${file.type} is not allowed.`
            form.emit('error', new Error(errorMsg))

            const finalFile = {
              name: file.name,
              originInfo: file,
              error: errorMsg
            }

            await uploadOpts.onFail(finalFile, field)

            failFiles.push(finalFile)
          }
        })
        .on('part', function (part) {
          const type = part.headers['content-type']
          if (!type || !this.opts.limit.mimeType.includes(type)) {
            this.emit(
              'error',
              new Error('The file type ${type} is not allowed.')
            )
          }
        })
        .on('field', async (field, value) => {
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
            (uploadOpts.savePrefix && uploadOpts.savePrefix.trim() !== ''
              ? `${uploadOpts.savePrefix.trim()}/`
              : '') + `${dtime().format('YYYYMMDD')}`
          const saveName =
            uploadOpts.keepOriginName || !uploadOpts.isSaveDir
              ? file.name
              : `${udidv4()}${suffix}`
          const fileSaveDirPath = path.join(this.opts.saveDir, savePathName)
          const filePath = uploadOpts.isSaveDir
            ? path.join(fileSaveDirPath, saveName)
            : file.path

          let url

          if (uploadOpts.isSaveDir && filePath !== file.path) {
            await utils.createDirsSync([fileSaveDirPath])
            await fs.copyFileSync(file.path, filePath)
            url = `${this.opts.virtualPath}/${savePathName}/${saveName}`
          }

          if (
            uploadOpts.removeTmp &&
            uploadOpts.isSaveDir &&
            (await fs.existsSync(file.path))
          ) {
            await fs.rmSync(file.path)
          }

          let finalFile = {
            url,
            name: saveName,
            hash: file.hash,
            path: filePath,
            type: file.type,
            suffix: suffix,
            size: file.size,
            field: field,
            originInfo: file
          }

          finalFile.successRlt = await uploadOpts.onSuccess(finalFile, field)

          successFiles.push(finalFile)
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

module.exports = FileUpload
