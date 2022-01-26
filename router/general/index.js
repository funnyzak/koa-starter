'use strict'

const GeneralCtrl = require('../../controller/general')

module.exports = [
  {
    method: 'get',
    path: '/',
    controller: GeneralCtrl.indexView
  },
  {
    method: 'get',
    path: '/:nofound',
    controller: GeneralCtrl.noFoundView
  }
]
