'use strict'

// document https://joi.dev/api/
const Joi = require('joi')

const _tokenJoi = Joi.string().min(3).max(32)

const checkToken = {
  headers: Joi.object({
    'x-token': [_tokenJoi],
    'x-app-id': Joi.string().min(1)
  }),
  query: Joi.object({
    'x-token': [_tokenJoi],
    'x-app-id': Joi.string().min(1)
  })
}

module.exports = {
  checkToken
}
