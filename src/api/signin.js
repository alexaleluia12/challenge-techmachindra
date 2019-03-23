const Joi = require('joi');
const bcrypt = require('bcrypt');

const UserModel = require('../model/user');
const utils = require('../lib/utils');
const userPresenter = require('./userPresenter');
const { UserSignIn } = require('../model/inputSchema');

module.exports = (req, res) => {
  const { body } = req;
  const msgErrorEmailPassword = 'Usuário e/ou senha inválidos';

  Joi.validate(body, UserSignIn)
    .then((validInput) => {
      let { email } = validInput;
      email = email.toLowerCase();

      return UserModel.find({ email: { $regex: new RegExp(`^${email}$`) } })
        .then((users) => {
          if (users.length === 0) {
            return res.status(404).send(utils.errorOutput(msgErrorEmailPassword));
          }

          const user = users[0];
          return bcrypt.compare(validInput.senha, user.senha)
            .then((passMatch) => {
              if (passMatch) {
                // update ultimo_login and data_atualizacao to current time
                const now = new Date();
                user.ultimo_login = now;
                user.data_atualizacao = now;

                return user.save()
                  .then(updatedUser => res.send(userPresenter(updatedUser._doc, validInput)))
                  .catch((err) => { throw err; });
              }
              return res.status(401).send(utils.errorOutput(msgErrorEmailPassword));
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
