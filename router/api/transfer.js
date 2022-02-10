'use strict'

const TransferCtrl = require('../../controller/api/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')
const { checkToken } = require('../../schema/token')

module.exports = [
  {
    method: 'put',
    path: '/transfer',
    controller: TransferCtrl.transfer,
    checkParam: checkToken,
    middleware: bodyParse()
  }
]
