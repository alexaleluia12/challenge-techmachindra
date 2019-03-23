const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const UserModel = require('../model/user');
const utils = require('../lib/utils');
const userPresenter = require('./userPresenter');
const config = require('../config.js');

class ValidationError extends Error { }

const ERROR_MSG = 'Não autorizado';

/**
 * Validate token - http header value
 * @param {String} authorization
 * @returns {Object} - Decoded jwt payload
 */
async function validateAuthorization(authorization) {
  if (!authorization) {
    throw new ValidationError(ERROR_MSG);
  }

  let token = null;
  try {
    token = utils.extractToken(authorization);
  } catch (error) {
    throw new ValidationError(error.message);
  }

  let publicKey = null;
  try {
    publicKey = await utils.readPublicKey();
  } catch (error) {
    throw error;
  }

  const pVerify = promisify(jwt.verify);
  try {
    const algoritims = [config.jwtAlgorithm];
    const decodedInformation = await pVerify(token, publicKey, { algorithm: algoritims });
    return decodedInformation;
  } catch (error) {
    throw new ValidationError(error.message);
  }
}

module.exports = (req, res) => {
  const { user_id } = req.params;
  const { authorization } = req.headers;

  return validateAuthorization(authorization)
    // NOTE: is possible to search the user from id after decode jwt payload
    .then(() => {
      const token = utils.extractToken(authorization);
      return UserModel.find({ id: user_id })
        .then((users) => {
          if (users.length === 0) {
            return res.status(401).send(utils.errorOutput(ERROR_MSG));
          }

          const user = users[0];
          if (user.token !== token) {
            return res.status(401).send(utils.errorOutput(ERROR_MSG));
          }

          const SECONDS = 60;
          const tsPass30Minutes = Math.floor(new Date().getTime() / 1000) - (SECONDS * 30);
          const pass30Minutes = new Date(tsPass30Minutes * 1000);
          if (user.ultimo_login >= pass30Minutes) {
            return res.send(userPresenter(user._doc, {}));
          }
          return res.status(401).send(utils.errorOutput('Sessão inválida'));
        })
        .catch((err) => { throw err; });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(401).send(utils.errorOutput(err.message));
      }
      console.error(err);
      return res.status(500).send(utils.errorOutput('internal error'));
    });
};
