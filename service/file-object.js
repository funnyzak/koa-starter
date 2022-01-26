'use strict'

const ErrorMsg = require('../common/error-msg')
const ErrorCode = require('../common/error-code')
const SysError = require('../common/sys-error')
const StatusCode = require('../common/status-code')

const logger = require('../lib/logger')

const MongoData = require('../models/mongo')

module.exports = async () => {
  try {
    return await MongoData.collection('file-object')
  } catch (err) {
    logger.error({ msg: err.message, stack: err.stack })
    throw new SysError(
      ErrorMsg.DB_ERROR,
      ErrorCode.DB_ERROR,
      StatusCode.BAD_REQUEST
    )
  }
}

// import FileObject = require('./file-object')

// const fileObject = await FileObject()
// logger.info({
//   msg: 'create mongo demo data.',
//   data: await fileObject.utils.create({
//     name: 'hello world',
//     path: '/abc/1.jpg',
//     md5: 'kehdkweisdsjsdie',
//     size: 2048
//   })
// })
