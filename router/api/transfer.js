'use strict'

const TransferCtrl = require('../../controller/api/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')
const { checkToken } = require('../../schema/token')
const TokenMdw = require('../../middleware/token')
const { TOKEN_TYPE } = require('../../service/token')

module.exports = [
  {
    // demo: api/v1/transfer?signature=false&saveCloud=true&_token=helloworld&_app=transfer
    method: 'put',
    path: '/transfer',
    controller: TransferCtrl.transfer,
    checkParam: checkToken,
    middleware: [TokenMdw({ app: TOKEN_TYPE.TRANSFER }), bodyParse()]
  }
]
