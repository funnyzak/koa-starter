'use strict'

const TransferCtrl = require('../../controller/general/transfer')
const { checkToken } = require('../../schema/token')
const { transferPut } = require('../../schema/transfer')
const TokenMdw = require('../../middleware/token')
const UploadMdw = require('../../middleware/upload')
const { TOKEN_TYPE } = require('../../service/token')
const _ = require('lodash')
const config = require('../../config')

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
      // 上传
      UploadMdw(
        _.merge(config.app.upload, {
          keepOriginName: false,
          removeTmpFile: false,
          isSaveDir: false
        })
      )
    ]
  },
  {
    method: 'put',
    path: '/transfer2',
    checkParam: transferPut,
    controller: TransferCtrl.transfer2,
    middleware: [
      // token验证
      // TokenMdw({ app: TOKEN_TYPE.TRANSFER }),
      // 上传
      UploadMdw(
        _.merge(config.app.upload, {
          keepOriginName: true,
          removeTmpFile: true,
          isSaveDir: true,
          savePrefix: 'transfer2'
        })
      )
    ]
  }
].map((router) => {
  router.checkParam = _.merge(checkToken, router.checkParam)
  return router
})
