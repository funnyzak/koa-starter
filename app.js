import path from 'path';
import Koa from 'koa';
import favicon from 'koa-favicon';
import serve from 'koa-static';
import responseTime from 'koa-response-time';
import json from 'koa-json';
import views from 'koa-views';
import config from './config';
import router from './route';
import logger from './lib/logger';

const app = new Koa();

// load plugin
app.use(favicon(process.cwd() + '/public/favicon.ico'));

// static server
app.use(
  serve(process.cwd() + '/public', {
    maxage: 5000
  })
);

app.use(responseTime());

// json pretter
app.use(json());

app.use(views(path.join(process.cwd(), '/views/ejs'), { extension: 'ejs' }));

// use router
router(app);

app.use(async (ctx) => {
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
