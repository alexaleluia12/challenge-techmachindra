const Joi = require('joi');

const UserSignUp = Joi.object().keys({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  telefones: Joi.array().items({
    numero: Joi.string().regex(/^\d{8,9}$/).required(),
    ddd: Joi.string().regex(/^\d{2}$/).required(),
  }).min(1),
}).required();

const UserSignIn = Joi.object().keys({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
}).required();


module.exports = {
  UserSignUp,
  UserSignIn,
};
