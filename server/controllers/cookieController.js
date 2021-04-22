const User = require('../models/userModel');

const cookieController = {};

/**
 * setCookie - set a cookie with a random number
 */
cookieController.setCookie = (req, res, next) => {
  res.cookie('Codesmith', 'hi');
  res.cookie('secret', Math.floor(Math.random() * 100));
  return next();
};

/**
 * setSSIDCookie - store the user id in a cookie
 */
cookieController.setSSIDCookie = (req, res, next) => {

  res.cookie('ssid', res.locals.user.id, { httpOnly: true });

  console.log("SETSSIDCOOKIE FIRED")

  
  return next();
};
  // User.findOne({
  //   username: req.body.username,
  //   password: req.body.password,
  // }).then((response) => {
  //   // found from login page response
  //   console.log("SETSSIDCOOKIE FIRED")
  //   const responseId = response._id.id;
  //   res.cookie('SSID', responseId, {httpOnly: true});
  //   return next();
  // });
// };

module.exports = cookieController;
