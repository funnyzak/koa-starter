const config = require('../../config')
const logger = require('../../lib/logger')

const IoRedisClient = require('../../lib/db/ioredis')

let RedisDB = new IoRedisClient(config.db.redis)

!(async () => {
  logger.info(
    `Redis connected successfully. config=> ${JSON.stringify(config.db.redis)}`
  )
  await RedisDB.client.set(`hello`, 'leon', 'EX', 10)
})()

module.exports = RedisDB.client
