const express = require("express");
// const router = express.Router({mergeParams:true});
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");

const userControllor = require("../controllers/user.js");


router
  .route("/signup")
  .get(userControllor.signUpPage)
  .post( wrapAsync(userControllor.userSingup));


router
  .route("/login")
  .get(userControllor.loginPage)
  .post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect :"/login", failureFlash:true }), 
    userControllor.loggedIn 
  );

router.get('/logout', userControllor.userLogout);

module.exports = router;
// SignUp GET method
//router.get("/signup",userControllor.signUpPage);

// SignUp POST method
//   router.post("/signup", wrapAsync(userControllor.userSingup));

// login GET method
// router.get("/login", userControllor.loginPage);

// login POST method
// //router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {failureRedirect :"/login", failureFlash:true }), 
//     userControllor.loggedIn 
//  // );

// Logout Route

