
const Listing = require("../models/listings.js")

module.exports.index = async(req,res) => {
    const allListing = await Listing.find({});    
    res.render("listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req, res,)=>{
    res.render("listings/new.ejs");
};

module.exports.showRender = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path:"author"
        }
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log("listing:-",listing);
    res.render("listings/show.ejs",{ listing });
};

module.exports.postListing = async(req, res, next)=>{
    
    let url = req.file.path;
    let filename = req.file.filename;
    // creating new listing
    let newListing = new Listing(req.body.listing); 
    console.log(req.user);
    // confirming owner of added listing
    newListing.owner = req.user._id;

    newListing.image = {url,filename};
    // saving listing in database
    await newListing.save();
       
    req.flash("success","New Listing Created");  
    res.redirect("/listings");
};

module.exports.editListingRender = async(req, res)=>{
    
    // got id of existing listings by req.params 
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    
    // checking requested listing exist or not 
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");  
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_400");
    res.render("./listings/edit.ejs",{listing, originalImageUrl});
 };

 module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
  
    req.flash("success","Listing Updated!"); 
    res.redirect(`/listings/${id}`)
    };

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted"); 
    res.redirect("/listings")
    };