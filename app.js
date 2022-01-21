import path from 'path';
import Koa from 'koa';
import favicon from 'koa-favicon';
import koaBody from 'koa-body';
import serve from 'koa-static';
import responseTime from 'koa-response-time';
import json from 'koa-json';
import views from 'koa-views';

import config from './config';
import router from './route';
import logger from './logger';

const app = new Koa();

// load plugin
app.use(favicon(__dirname + '/public/favicon.ico'));

// body parse 2 multipart
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    encoding: 'utf-8',
    jsonLimit: 1024 * 1024,
    formLimit: 1024 * 1024,
    patchNode: true,
    onError: (error, context) => {
      console.error(
        'request error:',
        JSON.stringify(error),
        'context:',
        JSON.stringify(context)
      );
    },
    formidable: {
      uploadDir: path.join(__dirname, 'public/upload/tmp/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 100 * 1024 * 1024, // 文件上传大小
      hash: 'md5',
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        console.log(`file name: ${name}`);
        // console.log(file);
      }
    }
  })
);

// static server
app.use(
  serve(__dirname + '/public', {
    maxage: 5000
  })
);

app.use(responseTime());

// json pretter
app.use(json());

app.use(views(path.join(__dirname, '/views/ejs'), { extension: 'ejs' }));

// app.use(async (ctx) => {
//   ctx.append('Code-By', '<Leon>silenceace@gmail.com')
// })

// use router
router(app);

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

logger.info(
  `listening port ${config.app.port}. open http://127.0.0.1:${config.app.port}`
);
