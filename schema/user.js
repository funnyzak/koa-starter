'use strict'

const Joi = require('joi')

const _userNameJoi = Joi.string().alphanum().min(3).max(30).required()

const checkUser = {
  router: Joi.object({
    username: _userNameJoi
  })
}

const getUser = {
  router: Joi.object({
    username: _userNameJoi
  })
}

module.exports = {
  checkUser,
  getUser
}
