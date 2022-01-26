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
      doc.createdAt = new Date()
      doc.updatedAt = new Date()

      await mongoCollection.insertOne(doc)

      return doc
    },
    update: async function (query, doc) {
      doc.updatedAt = new Date()

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
      doc.updatedAt = new Date()

      const set = {
        $set: doc,
        $setOnInsert: {
          createdAt: new Date()
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

      return result.value
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
  constructor(opts) {
    const { uri, db } = opts

    this.opts = opts
    this.client = new MongoClient(uri)

    this.ping = this.ping.bind(this)
    this.connect = this.connect.bind(this)
    this.close = this.close.bind(this)
    this.collection = this.collection.bind(this)
  }

  /**
   * 检查链接是否成功
   * @returns
   */
  async ping(db) {
    try {
      return (await this.collection()) !== null
    } finally {
      this.close()
    }
  }

  async connect(db) {
    await this.collection(null, db)
  }

  async database(db) {
    await this.collection(null, db)
  }

  async close() {
    await this.client.close(true)
  }

  /**
   * 获取collection对象
   * @param {*} collectionName
   * @param {*} db
   * @returns
   */
  async collection(collectionName, db) {
    const _db = db ? db : this.opts.db
    try {
      await this.client.connect()
      const database = this.client.db(_db)
      if (
        !collectionName ||
        collectionName === null ||
        collectionName.length === 0
      ) {
        return database.get
      }

      let _collection = database.collection(collectionName)
      _collection = collectionUtils(_collection)

      return _collections
    } catch (e) {
      logger.error(`Connection ${_db} error: JSON.stringify(e)`)
      return null
    }
  }
}

// examples
// require MongoDBClient, { MongoDbUtils } from './mongo'

// const mongoDb = new MongoDBClient({
//   db: 'testdb',
//   uri: 'mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority'
// })

// const collection = MongoDbUtils(mongoDb.collection('users'))
// const collection = mongoDb.collection('users')

// const user = await collection.utils.get({ username: 'terrajs' })
// mongoDb.close()

module.exports.collectionUtils = collectionUtils
module.exports = MongoDbClient
