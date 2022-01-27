'use strict'

/**
 * document
 *
 * https://docs.redis.com/latest/rs/references/client_references/client_nodejs/
 */

const _ = require('lodash')
const redis = require('redis')

const logger = require('../lib/logger')

class RedisDbClient {
  constructor(config) {
    this.config = _.merge({ host: '127.0.0.1', port: 6379 }, config)
    this.client = this.initialize(this.config)
  }

  initialize(config) {
    const acl = config.password && config.username
    let client = redis.createClient(
      _.merge({ host: config.host, port: config.port }, acl ? {} : config)
    )

    // 如果使用 ACLs
    if (acl) {
      client['auth'] = null
      client.send_command('AUTH', [config.username, config.password])
    }
    client.on('error', (err) => {
      logger.error({
        msg: err.message,
        stack: err.stack,
        type: LogType.REDIS_ERROR
      })
      throw err
    })

    return client
  }
}

module.exports = RedisDbClient
