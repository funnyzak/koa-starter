const config = require('../../config')
const logger = require('../../lib/logger')

const MongoDbClient = require('../../lib/db/mongo')

let MongoDB = new MongoDbClient(config.db.mongoDb)
if (MongoDB.ping()) logger.info(`MongoDB ${MongoDB.opts.db} is ok.`)

module.exports = MongoDB
