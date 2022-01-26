'use strict'

import ErrorCode from './error-code'
import StatusCode from './status-code'

export default class SysError extends Error {
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
