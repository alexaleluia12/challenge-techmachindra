const { Router } = require('express');

const hello = require('./hello');

module.exports = (config, db) => {
  const router = Router();

  router.get('/hello', hello);

  return router;
};
