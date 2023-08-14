'use strict'

const config = require('../../config')

let client

if (config.app.mysql) {
  const MySqlDbClient = require('../../lib/db/mysql')
  client = new MySqlDbClient(config.db.mysql, __dirname)
}

module.exports.client = client
module.exports = client ? client.instance : undefined
