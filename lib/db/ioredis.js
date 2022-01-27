'use strict'

/**
 * document
 *
 * https://docs.redis.com/latest/rs/references/client_references/client_ioredis/
 * https://github.com/luin/ioredis?spm=a2c6h.12873639.0.0.26d6da67pmM8zr
 */

const _ = require('lodash')
const IORedis = require('ioredis')

class IORedisDbClient {
  constructor(config) {
    this.config = _.merge({ host: '127.0.0.1', port: 6379 }, config)
    this.client = this.initialize(this.config)
  }

  initialize(config) {
    let client = new IORedis(config.uri ? config.uri : config)
    return client
  }
}

module.exports = IORedisDbClient
