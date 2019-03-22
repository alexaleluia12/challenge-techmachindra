const mongoose = require('mongoose');

const { userSchema } = require('./dbSchema');

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
