'use strict'

const ErrorCode = require('./error-code')
const StatusCode = require('./status-code')

class SysError extends Error {
  constructor(
    message,
    errorCode = ErrorCode.UNKNOWN_ERROR,
    status = StatusCode.OK
  ) {
    super(message)

    this.code = errorCode
    this.status = status
  }
}

module.exports = SysError
