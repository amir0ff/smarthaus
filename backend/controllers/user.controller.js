const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');

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
  // Call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // Error from passport middleware
    if (err) return res.status(400).json(err);
    // Generate JWT for logged in user
    else if (user) return res.status(200).json({"token": user.generateJwt()});
    // Unknown user or wrong password response
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.getUser = (req, res, next) => {
  User.findOne({_id: req._id},
    (err, user) => {
      const {fullName, email} = {fullName: user.fullName, email: user.email};
      if (!user)
        return res.status(404).json({status: false, message: 'User not found!'});
      else
      // _.pick(user, ['fullName', 'email'])
        return res.status(200).json({status: true, user: {fullName, email}});
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
