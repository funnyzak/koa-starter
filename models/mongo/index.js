const config = require('../../config')
const logger = require('../../lib/logger')

let MongoDB

if (config.app.mongodb) {
  const MongoDbClient = require('../../lib/db/mongo')

  MongoDB = new MongoDbClient(config.db.mongoDb)
  if (MongoDB.ping())
    logger.info(
      `MongoDB connected successfully. config=> ${JSON.stringify(
        config.db.mongoDb
      )}`
    )
}

module.exports = MongoDB
