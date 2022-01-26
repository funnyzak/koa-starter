'use strict'

const Joi = require('joi')

const getUser = {
  router: {
    userId: Joi.string().required()
  }
}

module.exports = {
  getUser
}
