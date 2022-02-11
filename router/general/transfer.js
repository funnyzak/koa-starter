'use strict'

const LogType = require('../../common/log-type')
const SysError = require('../../common/sys-error')
const ErrorCode = require('../../common/error-code')
const ErrorMsg = require('../../common/error-msg')
const StatusCode = require('../../common/status-code')

const TransferCtrl = require('../../controller/general/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')
const { checkToken } = require('../../schema/token')
const { transferPut } = require('../../schema/transfer')
const TokenMdw = require('../../middleware/token')
const UploadMdw = require('../../middleware/upload')
const { TOKEN_TYPE } = require('../../service/token')
const _ = require('lodash')
const config = require('../../config')
const logger = require('../../lib/logger')

module.exports = [
  {
    /**
     * 支持多文件上传
      curl --location --request PUT 'http://127.0.0.1:2058/transfer?signature=1&cloud=1&x-app-id=1&x-token=2&&prefix=leon' \
      --form 'f=@/Users/potato/Downloads/开发人员面试评分表.pdf'
     * 
     */
    method: 'put',
    path: '/transfer',
    checkParam: transferPut,
    controller: TransferCtrl.transfer,
    middleware: [
      // token验证
      TokenMdw({ app: TOKEN_TYPE.TRANSFER }),
      // 二进制流
      bodyParse({
        maxSize: config.app.upload.limit.maxSize,
        uploadDir: config.app.upload.tmpDir,
        mimeType: config.app.upload.limit.mimeType
      })
    ]
  },
  {
    method: 'put',
    path: '/transfer2',
    controller: TransferCtrl.transfer2,
    middleware: [
      // token验证
      TokenMdw({ app: TOKEN_TYPE.TRANSFER }),
      // 上传
      UploadMdw(config.app.upload)
    ]
  }
].map((router) => {
  // router.checkParam ||= checkToken
  router.checkParam = _.merge(checkToken, router.checkParam)
  return router
})
