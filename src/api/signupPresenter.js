
/**
 * Modify data from db and input data to be presented
 */
module.exports = function signupPresenter(userModel, userInput) {
  // for now just change password
  const joinUser = Object.assign({}, userModel);
  joinUser.senha = userInput.senha;

  return joinUser;
};
