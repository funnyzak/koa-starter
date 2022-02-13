/**
 * reqfile.js
 * Copyright(c) 2022
 *
 * @Author  leon (silenceace@gmail.com)
 */

'use strict'

/**
 * Module dependencies.
 */

const formidable = require('formidable')
const _ = require('lodash')
const dtime = require('time-formater')
const { v4: udidv4 } = require('uuid')

const fs = require('fs')
const path = require('path')

/**
 * Humanized capacity unit
 * @param {*} bytes
 * @returns
 */
const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 B'
  var k = 1024
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

function createDirsSync(_paths) {
  return new Promise(async (resolve) => {
    ;(Array.isArray(_paths) ? _paths : [_paths]).forEach(async (_path) => {
      if (!(await fs.existsSync(_path))) {
        await fs.mkdirSync(_path, { recursive: true }, (err) => {
          if (err) {
            console.error(`mkdir ${_path} fail. error: ${JSON.stringify(err)}`)
          }
        })
      }
    })
    resolve(true)
  })
}

module.exports.bytesToSize = bytesToSize
module.exports.createDirsSync = createDirsSync

/**
 * 对request请求文件，过滤、检查、保存
 */
class RequestFiles {
  /**
   * options json object
   * @param {*} opts
   */
  constructor(opts = {}) {
    this.opts = _.merge(
      {
        // Virtual path for url generation
        virtualPath: 'http://localhost/upload',

        // The destination folder where the uploaded files are saved
        saveDir: path.join(__dirname, '../public/upload/tmp'),

        // Temporary storage folder for uploaded files
        tmpDir: path.join(__dirname, '../public/upload'),

        // When saving to the destination folder, whether the file name is saved as the original file name
        keepOriginName: false,

        // Whether to keep extensions when uploading files (default false)
        keepExtensions: true,

        // Callback function when upload encounters an error
        onError: (error) => {},

        /**
         * 文件上传成功后的回调函数
         * @param {*} file 文件
         * @param {*} field 对应字段名
         */
        onOk: async (file, field) => {},

        /**
         * 文件上传失败时的回调函数
         * @param {*} file
         * @param {*} field
         */
        onFail: async (file, field) => {},

        onFileBegin: async (name, file) => {},

        // upload limit
        limit: {
          // Collection of allowed file types for upload
          mimeType: ['image/jpeg', 'image/png', 'image/gif'],

          // limit the amount of memory all fields together (except files) can allocate in bytes (单次最大请求文件总容量)
          maxFieldsSize: 1000 * 1024 * 1024,

          // limit the size of uploaded file
          maxFileSize: 100 * 1024 * 1024
        },
        // formidable options, sess: https://github.com/node-formidable/
        formidable: {}
      },
      opts
    )
  }

  /**
   * process file request
   * @param {*} request object of node
   * @param {*} up_opts  upload options
   * @returns
   */
  process(req, up_opts = {}) {
    up_opts.onOk = 'onOk' in up_opts ? up_opts.onOk : this.opts.onOk
    up_opts.onFail = 'onFail' in up_opts ? up_opts.onFail : this.opts.onFail
    up_opts.onFileBegin = 'onFileBegin' in up_opts ? up_opts.onFileBegin : this.opts.onFileBegin
    up_opts.keepOriginName = 'keepOriginName' in up_opts ? up_opts.keepOriginName : this.opts.keepOriginName

    up_opts = _.merge(
      {
        // Folder prefix for the file name, e.g. '2022/hello'
        saveDirPrefix: null,

        // Whether to delete the temporary file after saving to the target file
        removeTmpFile: true,

        // Whether to save the file to the destination folder. Otherwise, the file is saved only to the temporary directory
        isSaveDir: true
      },
      this.opts,
      up_opts
    )

    return new Promise(async (resolve, reject) => {
      const req_length = req.headers['content-length'] && Number.parseInt(req.headers['content-length'])

      if (req_length && req_length > this.opts.limit.maxFieldsSize) {
        const errorMsg = `The total size of the upload cannot exceed ${bytesToSize(req_length)}.`

        logger.error({
          type: LogType.RUN_INFO,
          msg: errorMsg
        })

        return reject(new SysError(errorMsg, ErrorCode.FILE_TOO_LARGE, StatusCode.BAD_REQUEST))
      }

      // create target folder
      await createDirsSync([this.opts.saveDir, this.opts.tmpDir])

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
          if (typeof up_opts.onError === 'function') {
            up_opts.onError(error, ctx)
          }
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

            await up_opts.onFail(finalFile, field)

            failFiles.push(finalFile)
          }
        })
        .on('part', function (part) {
          const type = part.headers['content-type']
          if (!type || !this.opts.limit.mimeType.includes(type)) {
            this.emit('error', new Error('The file type ${type} is not allowed.'))
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
            (up_opts.savePrefix && up_opts.savePrefix.trim() !== '' ? `${up_opts.savePrefix.trim()}/` : '') + `${dtime().format('YYYYMMDD')}`
          const saveName = up_opts.keepOriginName || !up_opts.isSaveDir ? file.name : `${udidv4()}${suffix}`
          const fileSaveDirPath = path.join(this.opts.saveDir, savePathName)
          const filePath = up_opts.isSaveDir ? path.join(fileSaveDirPath, saveName) : file.path

          let url

          if (up_opts.isSaveDir && filePath !== file.path) {
            await createDirsSync([fileSaveDirPath])
            await fs.copyFileSync(file.path, filePath)
            url = `${this.opts.virtualPath}/${savePathName}/${saveName}`
          }

          if (up_opts.removeTmp && up_opts.isSaveDir && (await fs.existsSync(file.path))) {
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

          finalFile.successRlt = await up_opts.onSuccess(finalFile, field)

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

module.exports = RequestFiles
