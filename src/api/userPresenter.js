
/**
 * Modify data from db and input data to be presented
 */
module.exports = function userPresenter(userModel, userInput) {
  // for now just change password
  const joinUser = Object.assign({}, userModel);
  joinUser.senha = userInput.senha;

  delete joinUser.__v;
  delete joinUser._id;

  return joinUser;
};
