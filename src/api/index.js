const { Router } = require('express');

const signup = require('./signup');
const signin = require('./signin');
const getUser = require('./getUser');

module.exports = () => {
  const router = Router();

  router.post('/user/signup', signup);
  router.post('/user/signin', signin);
  router.get('/user/:user_id', getUser);

  return router;
};
