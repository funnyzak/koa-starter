const path = require('path');
const Koa = require('koa');
const favicon = require('koa-favicon');
const koaBody = require('koa-body');
const serve = require('koa-static');
const responseTime = require('koa-response-time');
const json = require('koa-json');
const views = require('koa-views');

const config = require('./config');
const router = require('./router');
const app = new Koa();

// load plugin
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, 'public/upload/tmp/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        console.log(`name: ${name}`);
        // console.log(file);
      }
    }
  })
);

app.use(
  serve(__dirname + '/public', {
    maxage: 5000
  })
);

app.use(responseTime());

// json pretter
app.use(json());

app.use(views(path.join(__dirname, '/views/ejs'), { extension: 'ejs' }));

// use router
router(app);

// app.use(ctx => {
// the parsed body will store in ctx.request.body
// if nothing was parsed, body will be an empty object {}
// ctx.body = ctx.request.body;

//   ctx.body = 'hello world';
// });

app.use(async function pageNotFound(ctx) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

app.listen(config.app.port);
console.log('app listening on port ' + config.app.port);
