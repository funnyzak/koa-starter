'use strict';

import session from 'koa-session';
import app from '../app';
import config from '../config';

export default async (ctx, next) => {
  session({ ...config.koaSession.config }, app);
  await next();
};
