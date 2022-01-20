"use strict";

// document: https://github.com/ZijianHe/koa-router
const Router = require('@koa/router');


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
  .all('/', (ctx, next) => {
    ctx.body = 'hello world';
  });


const useRouter = (app, router) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
};

module.exports= app => {
  useRouter(app, ossRoute);
  useRouter(app, otherRoute);
};
