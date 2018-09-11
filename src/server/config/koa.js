require('isomorphic-fetch');
const path = require('path');
const requestLogger = require('koa-logger');
const serve = require('koa-static');
const mount = require('koa-mount');
const views = require('koa-views');
const route = require('koa-route');
const session = require('koa-session');
const { default: shopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const handlebars = require('handlebars');

const config = require('config');

const { SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET, SHOPIFY_APP_HOST } = config.session;
const { logger } = global;

const hmr = require('../hmr');

const pathToViews = path.join(__dirname, './../../client/views');
const pathToStatic = path.join(__dirname, './../../client/static');
handlebars.registerHelper('json', context => JSON.stringify(context));

const renderApp = async (ctx) => {
  const data = {
    isDev: config.isDev,
    config: {
      apiUrl: config.apiUrl,
    },
    user: {},
    token: '',
  };
  return ctx.render('index', data);
};

module.exports = async (app) => {
  app.use(requestLogger());
  app.keys = [SHOPIFY_APP_SECRET]; // eslint-disable-line
  app.use(session(app));

  app.use(
    shopifyAuth({
      prefix: '/shopify',
      apiKey: SHOPIFY_APP_KEY,
      secret: SHOPIFY_APP_SECRET,
      scopes: ['write_orders, write_products'],
      afterAuth(ctx) {
        // const {shop, accessToken} = ctx.session;
        // console.log('We did it!', accessToken);
        ctx.redirect('/');
      },
    }),
  );

  app.use(views(config.isDev ? pathToViews : pathToStatic, {
    default: 'html',
    map: { html: 'handlebars' },
    options: {
      helpers: {
        json: ctx => JSON.stringify(ctx),
      },
    },
  }));

  if (config.isDev) {
    const middleware = await hmr();
    app.use(middleware);
  } else {
    app.use(mount('/static', serve(pathToStatic)));
  }

  app.use(route.get('/install', async (ctx, next) => { await ctx.render('install'); }));
  app.use(verifyRequest({ fallbackRoute: '/install' }));

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err);
      this.status = err.status || 500;
      this.body = {
        errors: [{ _global: 'An error has occurred' }],
      };
    }
  });
  app.use(renderApp);
};
