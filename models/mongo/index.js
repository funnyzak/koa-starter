const config = require('../../config')
const logger = require('../../lib/logger')

const MongoDbClient = require('../../lib/db/mongo')

let MongoDB = new MongoDbClient(config.db.mongoDb)
if (MongoDB.ping())
  logger.info(
    `MongoDB connected successfully. config=> ${JSON.stringify(
      config.db.mongoDb
    )}`
  )

module.exports = MongoDB
