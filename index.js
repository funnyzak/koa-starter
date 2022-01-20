const Koa = require('koa');
const Router = require('@koa/router');
const favicon = require('koa-favicon');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const responseTime = require('koa-response-time');
const json = require('koa-json');

const config = require('./config');
const app = new Koa();
var router = new Router();

// load plugin
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser());

app.use(serve(__dirname + '/public', {
  maxage: 5000
}));

app.use(responseTime());

// json pretter
app.use(json());

// set router
router.get('/', (ctx, next) => {
  // ctx.router available
});


// use router
app
  .use(router.routes())
  .use(router.allowedMethods());

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
