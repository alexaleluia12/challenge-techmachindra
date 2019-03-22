const { Router } = require('express');

const hello = require('./hello');
const signup = require('./signup');

module.exports = () => {
  const router = Router();

  router.get('/hello', hello);
  router.post('/user/signup', signup);

  return router;
};
