'use strict';

// document: https://github.com/ZijianHe/koa-router
const Router = require('@koa/router');
import service from './service/index.js';

// aliyun oss router
const ossRoute = new Router({
  prefix: '/oss'
});
ossRoute
  .put('/put/:bucket', (ctx, next) => {
    // ...
  })
  .all('/', (ctx, next) => {
    ctx.body = 'aliyun oss';
  });

// other
const otherRoute = new Router();
otherRoute
  .put('/transfer', async (ctx, next) => {
    console.log(ctx.request.files);
    console.log(ctx.request.body);
    ctx.body = JSON.stringify(ctx.request.files);
  })
  .all('/', async (ctx, next) => {
    await ctx.render('index', {
      message: 'hello, 2022!'
    });
  });

const useRouter = (app, router) => {
  app.use(router.routes()).use(router.allowedMethods());
};

export default (app) => {
  useRouter(app, ossRoute);
  useRouter(app, otherRoute);
};
