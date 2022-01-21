'use strict';

// document: https://github.com/ZijianHe/koa-router
const Router = require('@koa/router');
import * as utl from '../lib/utils';
import service from '../service';

// aliyun oss router
const ossRoute = new Router({
  prefix: '/oss'
});
ossRoute
  .put('/put/:bucket', utl.bodyParse(), (ctx, next) => {
    // ...
  })
  .all('/', (ctx, next) => {
    ctx.body = 'aliyun oss';
  });

// other
const otherRoute = new Router();
otherRoute
  .put('/transfer', utl.bodyParse(), async (ctx, next) => {
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
