const User = require("../models/user.js");


module.exports.signUpPage = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.userSingup =async (req,res)=>{
    try{
        let {username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser,password);    // this is asynchronus method show we need to await it
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success","User Created Successfully")
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
};

module.exports.loginPage= (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.loggedIn = async(req, res)=>{
    req.flash("success","Welcome Back Our Woderlust Listing");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
 
module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err); // Redirect to the home page in case of an error
      }
      req.flash("success","you are logged Out")
      res.redirect("/listings");
    });
  }