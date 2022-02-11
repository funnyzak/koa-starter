'use strict'

const _ = require('lodash')
const crypto = require('crypto')
const fs = require('fs')
const util = require('util')
const path = require('path')
const { v4 } = require('uuid')
const dtime = require('time-formater')
const koaBody = require('koa-body')
const logger = require('./logger')
const LogType = require('../common/log-type')

let format = util.format

function koaBodyParse(uploadOps = { maxSize: 2 * 1024 * 1024 }, opts = {}) {
  return koaBody(
    _.merge(
      {
        multipart: true, // 支持文件上传
        encoding: 'utf-8',
        jsonLimit: 1024 * 1024,
        formLimit: 1024 * 1024,
        patchNode: true,
        onError: (error, context) => {
          logger.error(
            'koa body error:',
            JSON.stringify(error),
            'context:',
            JSON.stringify(context)
          )
        },
        formidable: {
          uploadDir:
            uploadOps.uploadDir ||
            path.join(__dirname, '../public/upload/tmp/'), // 设置文件临时上传目录
          keepExtensions: true, // 保持文件的后缀
          maxFileSize: uploadOps.maxSize, // 文件上传大小
          hash: 'md5',
          filter: ({ name, originalFilename, mimetype }) => {
            return (
              !uploadOps.mimeType ||
              uploadOps.mimeType === null ||
              uploadOps.mimeType.length === 0 ||
              (mimetype &&
                uploadOps.mimetype.find((_type) => mimetype === _type))
            )
          },
          onFileBegin: (name, file) => {
            logger.info({
              type: LogType.RUN_INFO,
              action: `收到二进制文件 ${name}`,
              file: file
            })
          }
        }
      },
      opts
    )
  )
}

/**
 * 计算文本Hash
 * @param {*} textToHash
 * @param {*} algorithm
 */
function textHash(textToHash, algorithm = 'md5') {
  let shasum = crypto.createHash(algorithm)
  shasum.update(textToHash)
  return shasum.digest('hex')
}

/**
 * 计算文件Hash
 * @param {*} filename 文件路径
 * @param {*} algorithm
 */
function fileHash(filename, algorithm = 'md5') {
  return new Promise((resolve, reject) => {
    // Algorithm depends on availability of OpenSSL on platform
    // Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
    let shasum = crypto.createHash(algorithm)
    try {
      let s = fs.ReadStream(filename)
      s.on('data', function (data) {
        shasum.update(data)
      })
      // making digest
      s.on('end', function () {
        const hash = shasum.digest('hex')
        return resolve(hash)
      })
    } catch (error) {
      return reject('计算Hash失败')
    }
  })
}

function uuid() {
  return v4().replace(/-/g, '')
}

function getNormalTimeStringByTimestamp(
  timeStamp = getTimestamp(),
  formatString = 'YYYY-MM-DD HH:mm:ss'
) {
  return dtime(timeStamp).format(formatString)
}

function getNormalTimeStringByDate(
  date = new Date(),
  formatString = 'YYYY-MM-DD HH:mm:ss'
) {
  return dtime(date.getTime()).format(formatString)
}

function getNormalTimeStringByDateString(
  dateString,
  formatString = 'YYYY-MM-DD HH:mm:ss'
) {
  return dtime(dateToTimestamp(dateString.toString())).format(formatString)
}

// 获取时间戳 （秒）
function getTimestamp(d) {
  return (d || new Date()).getTime()
}

function getSecondTimestamp(d) {
  return Number.parseInt((d || new Date()).getTime().toString() / 1000)
}

// 获取多位数字字符串
function rndNumberStr(n) {
  var rnd = ''
  for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10)
  return rnd
}

// 字符串加密 MD5
function md5(str) {
  var md5 = crypto.createHash('md5')
  md5.update(str)
  return md5.digest('hex')
}

// 密码
function password(str) {
  return md5(str).substr(6, 16)
}

// 随机token
function rndToken() {
  return md5(rndNumberStr(20))
}

// 循环创建目录
var mkdir = function (dirpath, dirname) {
  if (typeof dirname === 'undefined') {
    if (fs.existsSync(dirpath)) {
      return
    }
    mkdir(dirpath, path.dirname(dirpath))
  } else {
    if (dirname !== path.dirname(dirpath)) {
      mkdir(dirpath)
      return
    }
    if (fs.existsSync(dirname)) {
      fs.mkdirSync(dirpath)
    } else {
      mkdir(dirname, path.dirname(dirname))
      fs.mkdirSync(dirpath)
    }
  }
}

function subStrWithTail(str, subLength, startIndex = 0, tail = '..') {
  return str == null || str.length == 0
    ? ''
    : str.substr(startIndex, subLength) +
        (str.length - startIndex <= subLength ? '' : tail)
}

function getWeekDay(date = new Date()) {
  const day = date.getDay()
  //console.log(day)
  switch (day) {
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    case 0:
      return '日'
    default:
      return '-'
  }
}

function dateToTimestamp(date) {
  return new Date(Date.parse(date.replace(/-/g, '/'))).getTime()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function jsonToFromDataString(json) {
  let keys = Object.keys(json),
    urlParams = ''
  /**a.排序 升序 */
  keys.sort()
  /*b.url编码 c-d.url string */
  for (let key of keys.values()) {
    const encodeParam = encodeURIComponent(json[key])
    urlParams += `${key}=${encodeParam}&`
  }
  return urlParams.length > 0
    ? urlParams.substr(0, urlParams.length - 1)
    : urlParams
}

function jsonToPrintString(json, split = '\n') {
  let keys = Object.keys(json),
    formatString = ''
  /**a.排序 升序 */
  keys.sort()

  for (let key of keys.values()) {
    formatString += `${key}：${json[key]}${split}`
  }
  return formatString
}

function fromDataStringToJson(formData) {
  let json = {},
    keys = []
  for (let kv of formData.split('&')) {
    if (kv.split('=').length < 2) continue
    keys.push(kv.split('=')[0])
  }
  keys.sort()
  for (let key of keys.values()) {
    json[key] = decodeURIComponent(
      formData
        .split('&')
        .filter((kv) => {
          return kv.split('=')[0] == key
        })[0]
        .split('=')[1]
    )
  }
  return json
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

function bytesToSize(bytes) {
  if (bytes === 0) return '0 B'
  var k = 1024
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  // return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
  //toPrecision(3) 后面保留一位小数，如1.0GB
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

/**
 * 毫秒转时间表示
 * @param {*} ms
 */
function msTimeToShow(ms) {
  return humanTime(new Date(new Date().getTime() - parseInt(ms))).replace(
    '前',
    ''
  )
}

function humanTime(date) {
  let [now, time, tail] = [
    getSecondTimestamp(),
    Number.parseInt(date.getTime() / 1000),
    ''
  ]
  const _rlt = now - time

  tail = _rlt > 0 ? '前' : '后'
  const rlt = Math.abs(_rlt)
  //console.log(rlt)
  if (rlt <= 10) {
    return '现在'
  } else if (rlt < 60) {
    return rlt + '秒' + tail
  } else if (rlt < 3600) {
    return parseInt(rlt / 60) + '分钟' + tail
  } else if (rlt < 86400) {
    return parseInt(rlt / 3600) + '小时' + tail
  } else if (rlt < 2592000) {
    return parseInt(rlt / 86400) + '天' + tail
  } else if (rlt < 31104000) {
    return parseInt(rlt / 2592000) + '月' + tail
  } else if (rlt < 31104000 * 100) {
    return parseInt(rlt / 31104000) + '年' + tail
  }
  return getNormalTimeStringByDate(date)
}

function shuffle(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1))
    var itemAtIndex = arr[randomIndex]
    arr[randomIndex] = arr[i]
    arr[i] = itemAtIndex
  }
  return arr
}

/**
 * 转换为dollar格式显示
 * @param {*} nums
 * @param {*} c  是否保留小数点 几位
 * @param {*} d 小数点分隔符
 * @param {*} t  分隔符
 */
function dollar(nums, c = 2, d = '.', t = ',') {
  let n = nums
  c = isNaN((c = Math.abs(c))) ? 2 : c
  d = d == undefined ? '.' : d
  t = t == undefined ? ',' : t
  let s = n < 0 ? '-' : ''
  let i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))))
  let j = (j = i.length) > 3 ? j % 3 : 0
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

function wirteFile({ fileName = '', encoding = 'utf-8', data = '' }) {
  try {
    fs.writeFileSync(fileName, data, {
      encoding: encoding
    })
    return true
  } catch (error) {
    console.error('文件写入失败：', error)
    return false
  }
}

function readFile({ fileName = '', encoding = 'utf-8' }) {
  try {
    return fs.readFileSync(fileName, encoding)
  } catch (error) {
    return ''
  }
}

function imageToBase64(filepath, withHead = true) {
  try {
    let base64Str = fs.readFileSync(filepath).toString('base64')
    let ext = filepath.substr(filepath.lastIndexOf('.') + 1)
    let datauri = (withHead ? `data:image/${ext};base64,` : '') + base64Str
    return datauri
  } catch (error) {
    console.error('to base 64 error:', error)
    return ''
  }
}

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)

      if (typeof obj == 'object' && obj) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
}

/**
 * 获取ctx所有的二进制问津啊
 * @param {}} ctx
 * @returns
 */
function parseRequestFiles(ctx) {
  let files = []
  if (ctx.request.files) {
    const _files = ctx.request.files
    Object.keys(_files).map((key) => {
      let _tmpFiles = !Array.isArray(_files[key]) ? [_files[key]] : _files[key]
      files.push(
        ..._tmpFiles.map((v) => {
          return { ...v, key }
        })
      )
    })
  }
  return files
}

function createDirsSync(_paths) {
  return new Promise(async (resolve) => {
    ;(Array.isArray(_paths) ? _paths : [_paths]).forEach(async (_path) => {
      if (!(await fs.existsSync(_path))) {
        await fs.mkdirSync(_path, { recursive: true }, (err) => {
          if (err) {
            logger.error(`mkdir ${_path} fail. error: ${JSON.stringify(err)}`)
          }
        })
      }
    })
    resolve(true)
  })
}

module.exports = {
  createDirsSync,
  parseRequestFiles,
  isJSON,
  koaBodyParse,
  imageToBase64,
  wirteFile,
  readFile,
  dollar,
  shuffle,
  textHash,
  fileHash,
  msTimeToShow,
  humanTime,
  bytesToSize,
  jsonToPrintString,
  trim,
  jsonToFromDataString,
  fromDataStringToJson,
  sleep,
  getWeekDay,
  dateToTimestamp,
  getTimestamp,
  rndNumberStr,
  md5,
  rndToken,
  password,
  mkdir,
  getSecondTimestamp,
  getNormalTimeStringByTimestamp,
  getNormalTimeStringByDate,
  getNormalTimeStringByDateString,
  format,
  uuid,
  subStrWithTail
}
