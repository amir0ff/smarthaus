const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creating database user schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: 'Full name cannot be empty!'
  },
  email: {
    type: String,
    required: 'Email cannot be empty!',
    unique: true
  },
  password: {
    type: String,
    required: 'Password cannot be empty!',
    minlength: [8, 'Password must be at least 6 characters long!']
  },
  saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

// Saving MongoDB user document
userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

// Verifying user password
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Generating a JWT token
userSchema.methods.generateJWT = function () {
  return jwt.sign({_id: this._id},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    });
};

// Creating the MongoDB 'User' collection
mongoose.model('User', userSchema);
