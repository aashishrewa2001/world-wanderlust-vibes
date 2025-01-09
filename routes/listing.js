const express  = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateSchema} = require("../middleware.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateSchema, upload.single("listing[image]"), wrapAsync(listingController.postListing));
 
//Creating New listing route 
router.get("/new",isLoggedIn, listingController.renderNewForm);
//New Route For New listing-


router
    .route("/:id")
    .get(wrapAsync(listingController.showRender))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateSchema, wrapAsync(listingController.editListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//GET
//router.get("/",wrapAsync(listingController.index));
//GET

//READ
// show route indivially
//router.get("/:id", wrapAsync(listingController.showRender));

//New listing adding-POST-
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.postListing));
//POST
     
//EDIT UPDATE-PUT
// get request for edit
router.get("/:id/edit", isLoggedIn, isOwner, validateSchema, wrapAsync(listingController.editListingRender));

// put resquest on update page
//router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.editListing));
//EDIT UPDATE-PUT

//DELETE
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
//DELETE    

module.exports = router;