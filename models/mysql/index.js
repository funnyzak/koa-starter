'use strict'

const MySqlDbClient = require('../../lib/db/mysql')
const config = require('../../config')

const client = new MySqlDbClient(config.db.mysql, __dirname)

module.exports.client = client
module.exports = client.instance
