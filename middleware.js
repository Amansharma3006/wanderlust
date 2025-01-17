const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login Required for the action!!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
       res.locals.redirectUrl=req.session.redirectUrl;
       
    };
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to perform this action ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,review_id}=req.params;
    let review= await Review.findById(review_id);
    if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to perform this action ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};