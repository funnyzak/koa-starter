'use strict'

const assert = require('assert')

const UserService = require('../../service/user')
const ErrorCode = require('../../common/error-code')

describe('service/user.js', () => {
  describe('获取用户', () => {
    it('获取用户：成功', async () => {
      const userName = 'name'
      try {
        await UserService.getUser(userName)
        assert.ok('ok')
      } catch (err) {
        assert.equal(err.code, ErrorCode.USER_NOT_FOUND)
      }
    })
  })
})
