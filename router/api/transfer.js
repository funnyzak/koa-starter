'use strict'

const TransferCtrl = require('../../controller/api/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')

module.exports = [
  {
    method: 'put',
    path: '/transfer',
    controller: TransferCtrl.transfer,
    middleware: bodyParse()
  }
]
