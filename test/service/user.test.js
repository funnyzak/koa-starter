'use strict'

const assert = require('assert')

const UserService = require('../../service/user')

describe('service/user.js', () => {
  describe('获取用户', () => {
    it('获取用户：成功', async () => {
      const userName = 'name'

      const res = await UserService.getUser(userName)

      assert.equal(res.userName, userName)
    })
  })
})
