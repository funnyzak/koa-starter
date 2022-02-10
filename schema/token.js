'use strict'

// document https://joi.dev/api/
const Joi = require('joi')

const _tokenJoi = Joi.string().min(3).max(32).required()

const checkToken = {
  query: Joi.object({
    _token: [_tokenJoi],
    _app: Joi.string().min(1).required()
  })
}

module.exports = {
  checkToken
}
