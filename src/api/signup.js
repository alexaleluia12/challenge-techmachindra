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
 * @param {string} password - plain text password
 * @returns {object}
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

module.exports = (req, res) => {
  const { body } = req;

  Joi.validate(body, UserSignUp)
    .then((validInput) => {
      UserModel.find({ email: validInput.email })
        .then((users) => {
          if (users.length > 0) {
            return res.status(409).send(utils.errorOutput('E-mail já existente'));
          }
          return userRuntimeData(validInput.senha)
            .then((createdData) => {
              const newUserData = Object.assign(createdData, validInput);
              const user = new UserModel(newUserData);
              user.save()
                .then(() => res.send(signupPresenter(newUserData, validInput)))
                .catch((err) => { throw err; });
            })
            .catch((err) => { throw err; });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(utils.errorOutput('internal error'));
        });
    })
    .catch((err) => {
      if (err.isJoi) res.status(400).send(utils.errorOutput(err.message));
      else {
        console.error(err);
        res.status(400).send(utils.errorOutput('invalid user'));
      }
    });
};
