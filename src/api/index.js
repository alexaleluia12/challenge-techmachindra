const { Router } = require('express');

const signup = require('./signup');
const signin = require('./signin');

module.exports = () => {
  const router = Router();

  router.post('/user/signup', signup);
  router.post('/user/signin', signin);

  return router;
};
