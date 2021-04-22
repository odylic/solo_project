const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// use express.json() instead of bodyParser
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
const sessionController = require('./controllers/sessionController');

const PORT = 3000;

const app = express();
// Bodyparser
app.use(express.json());

// express.static assets, css, images
app.use('/public', express.static('public'));

// const mongoURI =
//   process.env.NODE_ENV === 'test'
//     ? 'mongodb://localhost/unit11test'
//     : 'mongodb://localhost/unit11dev';

const mongoURI = 'mongodb://localhost/3800';
mongoose.connect(mongoURI);

/**
 * Set our Express view engine as ejs.
 * This means whenever we call res.render, ejs will be used to compile the template.
 * ejs templates are located in the client/ directory
 */
app.set('view engine', 'ejs');

/**
 * Automatically parse urlencoded body content from incoming requests and place it
 * in req.body
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

/**
 * --- Express Routes ---
 * Express will attempt to match these routes in the order they are declared here.
 * If a route handler / middleware handles a request and sends a response without
 * calling `next()`, then none of the route handlers after that route will run!
 * This can be very useful for adding authorization to certain routes...
 */

/**
 * root
 */
app.get('/', cookieController.setCookie, (req, res) => {
  /**
   * Since we set `ejs` to be the view engine above, `res.render` will parse the
   * template page we pass it (in this case 'client/secret.ejs') as ejs and produce
   * a string of proper HTML which will be sent to the client!
   */
  res.render('./../client/index');
});

/**
 * signup
 */
app.get('/signup', (req, res) => {
  res.render('./../client/signup', {error: null});
});

app.get('/delete', (req, res) => {
  res.render('./../client/delete', {error: null});
});

app.post(
  '/signup',
  userController.createUser,
  sessionController.startSession,
  cookieController.setSSIDCookie,
  (req, res) => {
    // what should happen here on successful sign up?
    console.log('POST FIRED');
    // sets status 200 and redirecting
    res.redirect('/secret');
  }
);

app.post('/delete', userController.deleteUser, (req, res) => {
  console.log('DELETED FIRED');
  res.redirect('/secret');
});

/**
 * login
 */
app.post(
  '/login',
  userController.verifyUser,
  cookieController.setSSIDCookie,
  (req, res) => {
    // what should happen here on successful log in?
    // redirect to /secret.ejs
    res.redirect('/secret');
  }
);

/**
 * Authorized routes
 */
app.get('/secret', userController.getAllUsers, (req, res) => {
  /**
   * The previous middleware has populated `res.locals` with users
   * which we will pass this in to the res.render so it can generate
   * the proper html from the `secret.ejs` template
   */
  res.render('./../client/secret', {users: res.locals.users});
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  res.status(404).send('You done fucked up');
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;
