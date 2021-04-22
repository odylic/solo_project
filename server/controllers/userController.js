const User = require('../models/userModel');
const {request, response} = require('../server');
const bcrypt = require('bcryptjs');
const userController = {};

/**
 * getAllUsers - retrieve all users from the database and stores it into res.locals
 * before moving on to next middleware.
 */
userController.getAllUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    // if a database error occurs, call next with the error message passed in
    // for the express global error handler to catch
    if (err)
      return next(
        'Error in userController.getAllUsers: ' + JSON.stringify(err)
      );

    // store retrieved users into res.locals and move on to next middleware
    res.locals.users = users;
    return next();
  });
};

/**
 * createUser - create and save a new User into the database.
 */
// async await function
userController.createUser = async (req, res, next) => {
  // const username = req.body.username;
  const {username, password} = req.body;
  // if no username or password, return error message
  if (!username || !password)
    return next('Missing username or password in userController.createUser.');

  // try
  try {
    // declare variable, await result of async req.body.username and req.body.password promise from mongodb and then create User from UserSchema
    const newUser = await User.create({username, password});
    // store to local memory in res.local
    res.locals.user = newUser;
    console.log('USERCONTROLLER.CREATEUSER FIRED: ');
    // to next middleware
    return next();
    // catch for error
  } catch (err) {
    // res.render the /client/signup.ejs page with the <%error% being updated with the err
    return res.render('../client/signup', {error: err});
  }

  // User.create(req.body
  //   // username: req.body.username,
  //   // password: req.body.password,
  // )
  //   .then(() => {
  //     next();
  //   })
  //   .catch((err) => res.render('./../client/signup', {error: err}));
};

/**
 * verifyUser - Obtain username and password from the request body, locate
 * the appropriate user in the database, and then authenticate the submitted password
 * against the password stored in the database.
 */
userController.verifyUser = (req, res, next) => {
  // write code here
  // const username = req.body.username
  const {username, password} = req.body;
  // if no input, return error message
  if (!username || !password)
    return next('Missing username or password in userController.verifyUser.');

  console.log('VERIFYUSER FIRED');

  // mongo findOne first method in User database of {req.body.username} as an object
  User.findOne({username}, (err, user) => {
    if (err) {
      // error message
      return next(`Error in userController.verifyUser: ${JSON.stringify(err)}`);
    }
    // if no user, redirect to signup.ejs
    if (!user) res.redirect('/signup');

    // still in User.findOne, bcrypt compare password
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        // password did not match
        if (!result) {
          console.log('Wrong password');

          return;
        }
        // password match, save user for following middleware
        res.locals.user = user;
        return next();
      })
      // catch error
      .catch((error) =>
        // error while bcrypt running
        next(`Error in userController.verifyUser:${JSON.stringify(error)}`)
      );
  });
};

// console.log('LOGIN FIRED: ', req.body.username, req.body.password);
// // findOne instance of username and password in db
// User.findOne({username: req.body.username, password: req.body.password})
//   // .then (response ) only fires if it finds
//   .then((response) => {
//     // only fires if it finds
//     console.log('USER FINDONE RESPONSE: ', response._id.id);
//     if (response.password === req.body.password) {
//       return next();
//     } else {
//       // redirect to sign up page
//       res.redirect('./../client/signup');
//     }
//   })
//   // error: key in the object is linked to the error <%= error %> in ./../client/signup.ejs
//   .catch((err) => res.render('./../client/signup', {error: err}));

// end of UserController.verifyUser

userController.deleteUser = (req, res, next) => {
  // delete one user with the username in req.body.username

  User.findOneAndRemove({username: req.body.username}).then(next());
};

module.exports = userController;
