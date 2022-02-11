'use strict'

const TransferCtrl = require('../../controller/general/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')
const { checkToken } = require('../../schema/token')
const TokenMdw = require('../../middleware/token')
const { TOKEN_TYPE } = require('../../service/token')

module.exports = [
  {
    // demo: /transfer?signature=1&cloud=1?x-token=1&x-app-id=1
    method: 'put',
    path: '/transfer',
    controller: TransferCtrl.transfer,
    middleware: [TokenMdw({ app: TOKEN_TYPE.TRANSFER }), bodyParse()]
  }
].map((router) => {
  router.checkParam ||= checkToken
  return router
})
