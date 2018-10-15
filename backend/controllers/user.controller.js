const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.signup = (req, res, next) => {
  let user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save((err, doc) => {
    if (!err)
      res.send(doc);
    else {
      if (err.code === 11000)
        res.status(422).send(['Duplicate email address found!']);
      else
        return next(err);
    }

  });
};

module.exports.signin = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) return res.status(200).json({"token": user.generateJwt()});
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.getProfile = (req, res, next) => {
  User.findOne({_id: req._id},
    (err, user) => {
      if (!user)
        return res.status(404).json({status: false, message: 'User not found!'});
      else
        return res.status(200).json({status: true, user: _.pick(user, ['fullName', 'email'])});
    }
  );
};

module.exports.verifyJWT = (req, res, next) => {
  let token;
  if ('authorization' in req.headers)
    token = req.headers['authorization'].split(' ')[1];

  if (!token)
    return res.status(403).send({auth: false, message: 'No token provided!'});
  else {
    jwt.verify(token, process.env.JWT_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(401).send({auth: false, message: 'Token authentication failed!'});
        else {
          req._id = decoded._id;
          next();
        }
      }
    )
  }
};
