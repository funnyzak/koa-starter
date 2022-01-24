'use strict';

import ErrorCode from './error_code';
import StatusCode from './status_code';

class SysError extends Error {
  constructor(
    message,
    errorCode = ErrorCode.UNKNOWN_ERROR,
    status = StatusCode.OK
  ) {
    super(message);

    this.code = errorCode;
    this.status = status;
  }
}

module.exports = SysError;
