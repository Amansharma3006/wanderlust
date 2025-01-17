const Listing=require("../models/listing.js");


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
     res.render("listings/index.ejs",{allListings});
};
module.exports.newListingForm=(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.addNewListing=async(req,res)=>{
    // let listing=req.body.listing;
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    await newListing.save();
    req.flash("success","New Listing Added!!");
    res.redirect("/listings");
};
module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
       req.flash("error","listing you searched does not exists");
       res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});
};
module.exports.editListingForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","listing you searched does not exists");
       res.redirect("/listings")
    };
    let originalUrl=listing.image.url;
    originalUrl.replace("/upload","/upload/w_250,h_200");
    res.render("listings/edit.ejs",{listing,originalUrl});
};
module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
        await listing.save();
    }

    req.flash("success","Listing updated!!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!!");
    res.redirect("/listings");
};