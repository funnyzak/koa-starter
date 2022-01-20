const Koa = require('koa');
const config = require('./config');
const app = new Koa();

// 响应
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(config.app.port);
