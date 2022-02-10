'use strict'

/**
 * MongoDB Utils
 * by leon<silenceace@gmail.com>
 */

const { MongoClient, ObjectId } = require('mongodb')
const logger = require('../logger')

function getQueryFromArguments(query) {
  if (typeof query === 'string' || query instanceof ObjectId)
    return {
      _id: ObjectId(query)
    }
  return query
}

const collectionUtils = (mongoCollection) => {
  if (!mongoCollection || !mongoCollection.findOne)
    throw new Error('no-mongo-collection-provided')

  mongoCollection.utils = {
    get: function (query, fields) {
      if (Array.isArray(fields)) {
        const _fields = fields
        fields = {}
        _fields.forEach((field) => (fields[field] = 1))
      }
      return mongoCollection.findOne(getQueryFromArguments(query), {
        fields
      })
    },
    create: async function (doc) {
      doc.createdAt = new Date().getTime()
      doc.updatedAt = new Date().getTime()

      await mongoCollection.insertOne(doc)

      return doc
    },
    update: async function (query, doc) {
      doc.updatedAt = new Date().getTime()

      const set = {
        $set: doc
      }

      const result = await mongoCollection.findOneAndUpdate(
        getQueryFromArguments(query),
        set,
        {
          returnOriginal: false
        }
      )

      return result.value
    },
    upsert: async function (query, doc) {
      doc.updatedAt = new Date().getTime()

      const set = {
        $set: doc,
        $setOnInsert: {
          createdAt: new Date().getTime()
        }
      }

      const result = await mongoCollection.findOneAndUpdate(
        getQueryFromArguments(query),
        set,
        {
          returnOriginal: false,
          upsert: true
        }
      )

      return result.value !== null ? result.value : result.ok > 0 ? doc : null
    },
    remove: async function (query) {
      const result = await mongoCollection.deleteOne(
        getQueryFromArguments(query)
      )

      return !!result.deletedCount
    },
    find: function (query, options) {
      const cursor = mongoCollection.find(getQueryFromArguments(query))

      options = options || {}
      if (Array.isArray(options.fields)) {
        const fields = options.fields
        options.fields = {}
        fields.forEach((field) => (options.fields[field] = 1))
      }
      if (options.fields && Object.keys(options.fields).length)
        cursor.project(options.fields)
      if (options.limit) cursor.limit(options.limit)
      if (options.offset) cursor.skip(options.offset)
      if (options.sort) cursor.sort(options.sort)

      return cursor
    }
  }

  return mongoCollection
}

class MongoDbClient {
  constructor(config) {
    this.logging = config.logging
    this.config = config
    this.client = this.initizetion(config)
  }

  initizetion(config) {
    const { username, password, host, port, db, options, uri } = config

    const query =
      options && options !== null
        ? '?' +
          Object.keys(options)
            .map((key) => key + '=' + options[key])
            .join('&')
        : ''

    const _uri =
      uri && uri !== null
        ? uri
        : `mongodb://${username}:${password}@${host}:${port}/${db}${query}`

    let client = new MongoClient(_uri)

    const eventLogHandler = (_eventName, _event, level) => {
      if (this.logging) {
        logger.log(level || 'info', {
          eventName: _eventName,
          event: JSON.stringify(_event)
        })
      }
    }

    ;['commandStarted', 'commandSucceeded', 'commandFailed'].forEach(
      (eventName, idx) => {
        client.on(eventName, (_event) => {
          eventLogHandler(eventName, _event, ['info', 'info', 'error'][idx])
        })
      }
    )

    return client
  }

  /**
   * 检查链接是否成功
   * @returns
   */
  async ping(dbname) {
    return await this.command({ ping: 1 })
  }

  /**
   * 返回一个  MongoDB Database.
   * @param {*} dbname
   * @param {*} force
   * @returns
   */
  async connect(dbname, force) {
    try {
      const _dbname = dbname && dbname !== null ? dbname : this.config.db
      await this.client.connect()
      return await this.client.db(_dbname)
    } catch (error) {
      throw error
    } finally {
      if (force) await this.client.close()
    }
  }

  /**
   * 发送命令
   * @param {*} command
   * @param {*} dbname
   */
  async command(command, dbname) {
    try {
      const db = await this.connect(dbname, false)
      await db.command(command)
    } catch (error) {
      throw error
    } finally {
      await this.client.close()
    }
  }

  /**
   * 集合操作
   * @param {string} coln
   * @param {promise} callback Promise回调函数 参数： collection对象, database 对象
   * @param {string} db 可操作的对象
   * @returns
   */
  async colnSync(coln, callback, db) {
    try {
      const database = await this.connect(db)

      if (!coln || coln === null || coln.length === 0) {
        throw new Error('没有可操作的集合')
      }

      let _collection = database.collection(coln)

      _collection = collectionUtils(_collection)

      if (
        callback !== null &&
        ['object', 'function'].includes(typeof callback)
      ) {
        return await callback(_collection, database)
      }

      return null
    } catch (e) {
      logger.error({ msg: e.message, stack: e.stack })
      throw e
    }
  }
}

module.exports.collectionUtils = collectionUtils
module.exports = MongoDbClient
