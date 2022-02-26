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
         * Callback function after successful file upload
         * @param {*} file 文件
         * @param {*} field 对应字段名
         */
        onOk: async (file, field) => {},

        /**
         * Callback function after file upload failure
         * @param {*} file
         * @param {*} field
         */
        onFail: async (file, field) => {},

        onFileBegin: async (file) => {},

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
   * @param {*} opts  upload options
   * @returns
   */
  process(req, opts = {}) {
    opts.onOk = 'onOk' in opts ? opts.onOk : this.opts.onOk
    opts.onFail = 'onFail' in opts ? opts.onFail : this.opts.onFail
    opts.onFileBegin = 'onFileBegin' in opts ? opts.onFileBegin : this.opts.onFileBegin
    opts.keepOriginName = 'keepOriginName' in opts ? opts.keepOriginName : this.opts.keepOriginName

    opts = _.merge(
      {
        // Folder prefix for the file name, e.g. '2022/hello'
        saveDirPrefix: null,

        // Whether to delete the temporary file after saving to the target file
        removeTmpFile: true,

        // Whether to save the file to the destination folder. Otherwise, the file is saved only to the temporary directory
        isSaveDir: true
      },
      this.opts,
      opts
    )

    return new Promise(async (resolve, reject) => {
      // create target folder
      await createDirsSync([opts.saveDir, opts.tmpDir])

      const req_length = req.headers['content-length'] && Number.parseInt(req.headers['content-length'])

      if (req_length && req_length > opts.limit.maxFieldsSize) {
        const errorMsg = `The total size of the upload cannot exceed ${bytesToSize(req_length)}.`

        console.error(errorMsg)

        return reject(new Error(errorMsg))
      }

      let form = formidable(
        _.merge(
          {
            encoding: 'utf-8',
            hash: 'md5',
            allowEmptyFiles: false
          },
          opts.formidable,
          {
            uploadDir: opts.tmpDir,
            maxFileSize: opts.limit.maxFileSize,
            maxFieldsSize: opts.limit.maxFieldsSize,
            keepExtensions: opts.keepExtensions
          }
        )
      )

      let postField = {}
      let [successFiles, failFiles] = [[], []]

      form
        .on('error', (error) => {
          console.error(error.message, error.stack)
        })
        .on('end', () => {
          return resolve({
            success: successFiles,
            fail: failFiles,
            field: postField
          })
        })
        .on('fileBegin', async (field, file) => {
          console.info({
            action: `file => ${file.name} upload begin...`,
            file: file
          })

          let _file = {
            name: file.name,
            originInfo: file
          }

          if ('onFileBegin' in opts && typeof opts.onFileBegin === 'function') {
            await opts.onFileBegin(_file, field)
          }

          if (!opts.limit.mimeType.includes(file.type)) {
            const errorMsg = `The file type ${file.type} is not allowed.`

            _file.error = new Error(errorMsg)

            failFiles.push(_file)

            if ('onFail' in opts && typeof opts.onFail === 'function') {
              await opts.onFail(_file, field)
            }

            form.emit('error', new Error(errorMsg))
          }
        })
        .on('part', (part) => {
          const type = part.headers['content-type']
          if (!type || !opts.limit.mimeType.includes(type)) {
            form.emit('error', new Error('The file type ${type} is not allowed.'))
          }
        })
        .on('field', (field, value) => {
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
          if (!opts.limit.mimeType.includes(file.type)) {
            await fs.rmSync(file.path)
            return
          }

          const suffix = path.extname(file.name)

          const savePathName =
            (opts.savePrefix && opts.savePrefix.trim() !== '' ? `${opts.savePrefix.trim()}/` : '') + `${dtime().format('YYYYMMDD')}`
          const saveName = opts.keepOriginName ? `${file.name}` : `${udidv4()}${suffix}`
          const fileSaveDirPath = path.join(opts.saveDir, savePathName)
          const savePath = `${savePathName}/${saveName}`
          const filePath = path.join(fileSaveDirPath, saveName)

          let url = `${opts.virtualPath}/${savePath}`

          if (opts.isSaveDir && filePath !== file.path) {
            await createDirsSync([fileSaveDirPath])
            await fs.copyFileSync(file.path, filePath)
          }

          if (opts.removeTmpFile && opts.isSaveDir && (await fs.existsSync(file.path))) {
            await fs.rmSync(file.path)
          }

          let _file = {
            url,
            name: saveName,
            hash: file.hash,
            // file show save Path
            savePath,
            // file targe save path
            path: filePath,
            // file tmp save path
            tmpPath: file.path,
            type: file.type,
            suffix: suffix,
            size: file.size,
            field: field,
            originInfo: file
          }

          if ('Ok' in opts && typeof opts.Ok === 'function') {
            _file.successRlt = await opts.Ok(field, file)
          }

          successFiles.push(_file)
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
