const express = require("express");
const router = express.Router();
const User =require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

//Define Login Route

router.get("/login", (req, res) => res.render("login"));

router.get("/logout", (req, res) => res.render("logout"));

//Define Register route
router.get("/register", (req, res) => res.render("register"));
router.get("/dashboard", (req, res) => res.render("dashboard"));

// Post Request from Form to database

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  

  //! Check all the required fields
  if (!name || !email || !password || !password2) {
    //Push errors in empty array
    errors.push({ msg: "Please fill in all the fields" });
  }

  //!Check if passwords match

  if (password !== password2) {
    //Push error in the array
    errors.push({ msg: "Passwords do not match" });
  }

  //!Check password length

  if (password.length < 8) {
    errors.push({ msg: "Passwords should be atleast 8 characters" });
  }

  if(password.search(/[a-z]/i) < 0 || password.search(/[0-9]/) < 0) {
    errors.push({
      msg: 'Passwords should contain at least a letter and a digit'
    });
  }
  //! Render errors to the registration page if any
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation Passed
    User.findOne({ email: email }).then(user =>{
      if(user){
        errors.push({ msg: 'This Email is already registerd'});
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      }else{
        const newUser = new User({
          name,
          email,
          password
        });
        // Hash password to store in Database
        bcrypt.genSalt(10, (err, salt)=>{
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            // Stor hash in your password DB
            // Catch Error
            if(err) throw err;
            // set password to hashed
            newUser.password = hash;
            // save user
            newUser
           .save()
           .then(()=>{
             req.flash('success_msg', 
             'Your are now registered ... and can login');
             res.redirect('/users/login');
           })
           .catch(err => console.error(err));
          })
        });
        
      }
    })
    //res.send("Registration Succesfull");
    //Store user in database on success
  }
});

// Handle Login
router.post('/login', (req, res, next)=>{
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);
})

//Handle Logout
router.get("/logout", (req, res)=>{
  req.logout();
  req.flash("success_msg", "You are now logged out");
  res.redirect("/user/login")
})


//======================= routes fo facebook =========

//     router.get(passport.authenticate('facebook', { scope: ['email']}));
//     // .get((req,res)=>{
//     //   res.send('facebookkkkk')
//     // })

// router.get('/facebook/callback',passport.authenticate('facebook'),(req, res)=>{
//   console.log(req.user);
  
//       res.redirect('/dashboard')
//     })    

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', (req, res)=>{
  res.send('you reached the callback URI')
})
//==========================================================

// //======================= routes fo google =========

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get('/google/redirect', (req, res)=>{
  res.send('you reached the callback URI')
})

// //==========================================================
// //======================= routes for github =========

router.get('/github', passport.authenticate('github', {
  scope: ['profile']
}))

router.get('/github/redirect', (req, res)=>{
  res.send('you reached the callback URI')
})

// //==========================================================
// //======================= routes for Linkedin =========

// router.get('/linkedin', 
//   passport.authenticate('linkedin')
// )

// router.get('/linkedin/redirect', (req, res)=>{
//   res.send('you reached the callback URI')
// })


// //==========================================================


module.exports = router;
