const Session = require('../models/sessionModel');
const app = require('../server');
// const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
const {response} = require('express');
const sessionController = {};

/**
 * isLoggedIn - find the appropriate session for this request in the database, then
 * verify whether or not the session is still valid.
 */
sessionController.isLoggedIn = (req, res, next) => {
  // documents in the sessions collection will expire due to the schema expire setting
  console.log("ISLOGGEDIN FIRED")
  // find in sessions the cookies.ssid
  Session.findOne({cookieId: req.cookies.ssid}, (err, session) => {
    // database error
    if (err)
      return next(
        `Error in sessionController.isLoggedIn: ${JSON.stringify(err)}`
      );
    // no session found
    if (!session) res.redirect('/signup');
    // session found
    return next();
  });
};

/**
 * startSession - create and save a new Session into the database.
 */
sessionController.startSession = (req, res, next) => {
  // create session, assign cookieId to id stored from res.locals.user created in signup with userController.createUser
  console.log('STARTSESSION FIRED');

  Session.create({cookieId: res.locals.user.id}, (err, session) => {
    // error message
    if (err)
      return next(
        `Error in sessionController.startSession: ${JSON.stringify(err)}`
      );

    // return next middleware
    return next();
  });
};
// get SSID
// User.findOne({
//   username: req.body.username,
//   password: req.body.password,
// })
//   .then((response) => {
//     return response._id.id;
//   })
//   .then((SSID) => {
//     // create session
//     Session.create({
//       cookieId: SSID,
//     });
//   })
//   .then(() => {
//     next();
//   })
//   .catch((err) => err);
// };

module.exports = sessionController;
