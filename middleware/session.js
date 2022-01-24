'use strict';

import session from 'koa-session';
import app from '../app';
import config from '../config';

export default () => session({ ...config.koaSession.config }, app);
