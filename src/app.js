const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');
const api = require('./api');

/**
 * To difine middlware to application pass then to middlewares Array
 * like appBuilder([morgan('dev')])
 *
 * @returns Express application
 */
module.exports = function appBuilder(middlewares) {
  const app = express();

  // core middlewares
  app.use(bodyParser.json({
    limit: config.bodyLimit,
  }));
  app.use(cors());

  // application middlewares
  if (middlewares instanceof Array) {
    let middleware = null;
    for (let i = 0; i < middlewares.length; i += 1) {
      middleware = middlewares[i];
      app.use(middleware);
    }
  }

  // router middleware
  // shoud be the last middleware
  app.use(config.prefix, api(config, null));

  return app;
};
