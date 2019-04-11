const LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy; 
//const LinkedInStrategy = require('passport-linkedin').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const keys = require("./keys");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')

// Load User model
const User = require('../models/User');


module.exports = function() {

  //=======Auth with google====================
   
    passport.use(new GoogleStrategy({
      //opitions for google
      callbackURL: '/users/google/redirect',
      clientID: keys.google.googleID,
      clientSecret: keys.google.googleSecret


    },()=>{
      //passport cb function
    })
    )

  //============================================

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
      // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  //====================== login with facebook =====

  passport.use(new FacebookStrategy({
    //opitions for google
    callbackURL: '/users/facebook/callback',
    clientID: keys.facebook.FACEBOOK_APP_ID,
    clientSecret: keys.facebook.FACEBOOK_APP_SECRET 
  },()=>{
    //passport cb function
  })
  )
  //===============================================================
  //================ auth Github =================================
  passport.use(new GitHubStrategy({
    callbackURL: 'http://localhost:5002/users/github/redirect',
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret
  }, ()=>{
    
  }))
  //===============================================================
  //================ auth Linkedin =================================
  //  passport.use(new LinkedInStrategy({
  //   callbackURL: 'http://localhost:5002/users/linkedin/redirect',
  //   clientID: keys.linkedin.linkedinID,
  //   clientSecret: keys.linkedin.linkedinSecret
  // }, ()=>{
    
  // }))
//===============================================================

 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};