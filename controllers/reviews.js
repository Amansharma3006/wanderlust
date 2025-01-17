const Listing=require("../models/listing.js");
const review=require("../models/reviews.js");

module.exports.postNewReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    console.log(req.params.id);
    let newReview= new review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success","New review created!!");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.deleteReview=async(req,res)=>{
    let {id,review_id}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{"reviews":review_id}});
    await review.findByIdAndDelete(review_id);
    req.flash("success","Review deleted!!");
    res.redirect(`/listings/${id}`);
};
