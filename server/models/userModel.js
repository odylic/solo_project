const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Hint: Why is bcrypt required here?
 */
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

// No arrow functions, to use "this"
// 'save' is a presave hook, executes everytime the document is saved
userSchema.pre('save', function (next) {
  // this refers to entire document which has username and password properties
  const user = this;
  // user.password becomes the passed in property
  // bcrypt.hash, pw + salt
  bcrypt.hash(user.password, SALT_WORK_FACTOR, (err, hash) => {
    if (err) return next(err);
    // password is reassigned the hash
    user.password = hash;
    // return next middleware, moves on to the saving document
    return next();
  });
});

module.exports = mongoose.model('User', userSchema);
