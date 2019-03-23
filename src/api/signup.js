const { promisify } = require('util');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');

const UserModel = require('../model/user');
const utils = require('../lib/utils');
const config = require('../config.js');
const signupPresenter = require('./signupPresenter');
const { UserSignUp } = require('../model/inputSchema');

/**
 * Create runtime data for an user
 * @param {String} password - plain text password
 * @returns {Object}
 */
function userRuntimeData(password) {
  const user = {};

  return bcrypt.hash(password, config.saltRounds)
    .then((hash) => {
      user.senha = hash;
      const now = new Date();
      user.data_criacao = now;
      user.data_atualizacao = now;
      user.ultimo_login = now;
      user.id = uuidv4();

      return utils.readPrivateKey()
        .then((privateKey) => {
          const pSing = promisify(jwt.sign);
          return pSing({ id: user.id }, privateKey, { algorithm: config.jwtAlgorithm });
        })
        .catch((err) => { throw err; });
    })
    .then((token) => {
      user.token = token;
      return user;
    })
    .catch((err) => { throw err; });
}

/**
 * Clear signup input data
 * @param {Object} singnup
 * @returns {Object}
 */
function signupClear(singnup) {
  const singnupClered = Object.assign({}, singnup);
  const keys = Object.keys(singnup);
  let inputValue = null;
  let key = null;

  for (let i = 0; i < keys.length; i += 1) {
    key = keys[i];
    inputValue = singnupClered[key];
    singnupClered[key] = inputValue instanceof String ? inputValue.trim() : inputValue;
  }

  return singnupClered;
}

/**
 * Change signup to be saved on Database
 * @param {Object} signup
 * @returns {Object}
 */
function signupTransform(signup) {
  const signupTrans = Object.assign({}, signup);
  signupTrans.email = signupTrans.email.toLowerCase();
  return signupTrans;
}

module.exports = (req, res) => {
  const { body } = req;

  Joi.validate(body, UserSignUp)
    .then((validInput) => {
      const signup = signupTransform(signupClear(validInput));

      UserModel.find({ email: { $regex: new RegExp(`^${signup.email}$`) } })
        .then((users) => {
          if (users.length > 0) {
            return res.status(409).send(utils.errorOutput('E-mail já existente'));
          }
          return userRuntimeData(signup.senha)
            .then((createdData) => {
              const signupCopy = Object.assign({}, signup);
              const newUserData = Object.assign(signupCopy, createdData);
              const user = new UserModel(newUserData);

              return user.save()
                .then(() => res.send(signupPresenter(newUserData, signup)))
                .catch((err) => { throw err; });
            })
            .catch((err) => { throw err; });
        })
        .catch((err) => { throw err; });
    })
    .catch((err) => {
      if (err.isJoi) {
        res.status(400).send(utils.errorOutput(err.message));
      } else {
        console.error(err);
        res.status(500).send(utils.errorOutput('internal error'));
      }
    });
};
