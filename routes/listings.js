const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if({error}){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
//multer

//index route
router.get("/",wrapAsync(listingController.index));
//new listing form
router.get("/new",isLoggedIn,listingController.newListingForm);
//add new listing
 router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.addNewListing));
//Show route
router.get("/:id",wrapAsync(listingController.showListings));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));
//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing));
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;