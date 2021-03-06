require('dotenv').config();
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");
var nodemailer = require("nodemailer");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB or email already exists"
      });
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id
    });
  });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vamshitillutesting@gmail.com',
      pass: 'vamshi@1998'
    }
  });
  
  var mailOptions = {
    from: 'vamshitillutesting@gmail.com',
    to: `${user.email}`,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
     // console.log('Email sent: ' + info.response);
    }
  });
};


exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id,email, role } = user;
    var name = user.firstName + " " + user.lastName
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET, alogirithms: ['256'],
  userProperty: "auth"
})

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    })
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).json({
      error:"you are not admin"
    })
  }
  next();
}