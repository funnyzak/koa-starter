const config = require('../../config')
const logger = require('../../lib/logger')

let MongoDB

if (config.app.mongodb) {
  const MongoDbClient = require('../../lib/db/mongo')
  MongoDB = new MongoDbClient(config.db.mongoDb)
  MongoDB.ping()
    .then(() => {
      logger.info(
        `MongoDB connected successfully. config=> ${JSON.stringify(
          config.db.mongoDb
        )}`
      )
    })
    .catch((error) => {
      logger.error(
        `MongoDB connected failed. config=> ${JSON.stringify(
          config.db.mongoDb
        )} error=> ${error.message}`
      )
    })
}

module.exports = MongoDB
