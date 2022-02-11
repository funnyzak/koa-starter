'use strict'

const TransferCtrl = require('../../controller/general/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')
const { checkToken } = require('../../schema/token')
const TokenMdw = require('../../middleware/token')
const { TOKEN_TYPE } = require('../../service/token')

module.exports = [
  {
    /**
      curl --location --request PUT 'http://127.0.0.1:2058/transfer?signature=1&cloud=1&x-app-id=1&x-token=2' \
      --form 'f=@/Users/potato/Downloads/开发人员面试评分表.pdf'
     * 
     */
    method: 'put',
    path: '/transfer',
    controller: TransferCtrl.transfer,
    middleware: [TokenMdw({ app: TOKEN_TYPE.TRANSFER }), bodyParse()]
  }
].map((router) => {
  router.checkParam ||= checkToken
  return router
})
