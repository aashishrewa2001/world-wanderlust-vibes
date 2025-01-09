const express  = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewControllor = require("../controllers/review.js");


//---------review POST route--------------------------
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllor.reviewPost));
//---------review POST route--------------------------


//---------------------------Delete Review route---------------------------------------
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewControllor.deleteReview));


module.exports = router;