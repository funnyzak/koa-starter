'use strict'

const assert = require('assert')
const supertest = require('supertest')

const app = require('../../app')

const ErrorCode = require('../../common/error-code')
const config = require('../../config')

const request = supertest(app.listen())

describe('controller/test.js', () => {
  describe('第一个测试', () => {
    it('第一个测试', async () => {
      const { body } = await request
        .get(`${config.app.apiUrlPrefix}/test`)
        .set('Accept', 'application/json')

      assert.equal(body.data, '正常测试 OK')
    })
  })

  describe('抛出 undefined 的测试', () => {
    it('第抛出 undefined 的测试一个测试', async () => {
      const { body } = await request
        .get(`${config.app.apiUrlPrefix}/throw_undefined_error`)
        .set('Accept', 'application/json')
      assert.equal(body.code, ErrorCode.UNKNOWN_ERROR)
    })
  })

  describe('获取用户信息', () => {
    it('获取用户信息', async () => {
      const userName = 'leonn'

      const { body } = await request
        .get(`${config.app.apiUrlPrefix}/users/${userName}`)
        .set('Accept', 'application/json')

      assert.equal(body.code, ErrorCode.USER_NOT_FOUND)
    })
  })

  describe('无权限操作', () => {
    it('无权限操作', async () => {
      const { body } = await request
        .get(`${config.app.apiUrlPrefix}/no_permission`)
        .set('Accept', 'application/json')

      assert.equal(body.code, ErrorCode.NEED_LOGIN)
    })
  })
})
