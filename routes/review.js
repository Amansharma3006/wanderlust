const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if({error}){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
       next();
    }
}
//new review
router.post("/",isLoggedIn,wrapAsync(reviewController.postNewReview));

//delete review route
router.delete("/:review_id",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;