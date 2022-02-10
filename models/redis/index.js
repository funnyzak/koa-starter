const config = require('../../config')
const logger = require('../../lib/logger')

let RedisDB

if (config.app.redis) {
  !(async () => {
    const IoRedisClient = require('../../lib/db/ioredis')
    RedisDB = new IoRedisClient(config.db.redis)

    logger.info(
      `Redis connected successfully. config=> ${JSON.stringify(
        config.db.redis
      )}`
    )
    await RedisDB.client.set(`hello`, 'leon', 'EX', 10)
  })()
}
module.exports = RedisDB ? RedisDB.client : undefined
