'use strict'

// document https://joi.dev/api/
const Joi = require('joi')

const _userNameJoi = Joi.string().alphanum().min(3).max(30).required()

const checkUser = {
  router: {
    username: _userNameJoi
  }
}

const getUser = {
  router: {
    username: _userNameJoi
  }
}

module.exports = {
  checkUser,
  getUser
}
