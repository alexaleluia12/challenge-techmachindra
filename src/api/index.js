const { Router } = require('express');

const hello = require('./hello');
const signup = require('./signup');
const signin = require('./signin');

module.exports = () => {
  const router = Router();

  router.get('/hello', hello);
  router.post('/user/signup', signup);
  router.post('/user/signin', signin);

  return router;
};
