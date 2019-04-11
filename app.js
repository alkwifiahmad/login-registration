const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
// const bodyParser = require('body-parser');

// const FacebookStrategy = require('passport-facebook');

// const User = require('./models/User')

const app = express();
const PORT = process.env.PORT || 5002;

require('./config/passport')(passport)
const db = require("./config/keys").MongoDBURI;
//DB Configuration
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected..."))
  .catch(err => console.error(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Use session
app.use(session({
  secret: 'keyboard',
  resave: true,
  saveUninitialized: true
  
}))
//************************************************************ */
// passport.use(new facebookStrategy({
//   clientID: '790034158006798',
//   clientSecret: '3e774cdc32c896ea70e5cce9f6ca036a',
//   callbackURL: 'http://localhost:5002/auth/facebook/callback'
// },
// function(accessToken, refreshToken, profile, done) {
//   console.log(accessToken, refreshToken, profile);
//   User.findOrCreate(function (err, user) {
//     done(err, user);
//   });
// }
// ));
//**************************************************************************** */

//========================================

//========================================
// var facebook_App_Id = '790034158006798',
//     facebook_App_Secret = '3e774cdc32c896ea70e5cce9f6ca036a';

// var fbOpts = {
//   clientID: facebook_App_Id,
//   clientSECRET: facebook_App_Secret,
//   caalbackURL: 'http://localhost:5002/auth/facebook/callback'
// }


// var fbCallback = function(accessToken, refreshToken, profile, cb){
//     console.log(accessToken, refreshToken, profile)
// };



// passport.use(new facebookStrategy(fbOpts, fbCallback));

// app.route('/face').get(passport.authenticate('facebook'))

// app.route('/auth/facebook/callback')
//    .get(passport.authenticate('facebook', function(err, user, info){
//    console.log(err, user, info)
// }))

 // passwport middleware
 app.use(passport.initialize());
 app.use(passport.session());
//  app.use(express.bodyParser());
// use flash or Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
})

//Include Routes
//Use Home route
app.use("/", require("./routes/index"));
// Use users login and register routes
app.use("/users", require("./routes/users"));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
