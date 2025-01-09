if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methoOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User  = require("./models/user.js");

//Routing
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

// DB connections
main().then(()=>{
    console.log("DB is connected..");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);     
}


app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methoOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});
 
// session related error..
store.on("error" , () => {
    console.log("Error on MongoDB Session store" , err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET, // Keep this secure in production
    resave: false, // Prevents session resave if unmodified
    saveUninitialized: true, // Explicitly set to true or false based on your needs
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set cookie expiration date
        maxAge: 7 * 24 * 60 * 60 * 1000, // Set max-age for the cookie
        httpOnly: true, // Restricts cookie access to HTTP(S) requests
    },
};


// session middleware
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);


// all unexpecting route requeste
app.all("*", (req, res, next )=>{
    next(new ExpressError(404, "Page Not Found"));
});


// middleware error handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message ="Something went wrong"} = err;
    res.status(statusCode).render("./error.ejs" , {message});
});

// sever connecting endpoint
app.listen(8080,()=>{
    console.log("server is working..on port 8080");
});
 