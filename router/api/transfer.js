'use strict'

const TransferCtrl = require('../../controller/general/transfer')
const { koaBodyParse: bodyParse } = require('../../lib/utils')

module.exports = [
  {
    method: 'put',
    path: '/transfer/local',
    controller: TransferCtrl.localUpload,
    middleware: bodyParse()
  }
]
