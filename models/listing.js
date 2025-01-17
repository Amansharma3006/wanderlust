const mongoose=require("mongoose");
const schema=mongoose.Schema;
const review=require("./reviews.js")

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
        // default:"https://media.istockphoto.com/id/926497236/photo/tropical-sea-in-summer.webp?a=1&b=1&s=612x612&w=0&k=20&c=H6spc1r2plnY6zR3g-_mfj91GJse8hbXg6Er-FmhwoU",
        // set:(v)=>v===""?"https://media.istockphoto.com/id/926497236/photo/tropical-sea-in-summer.webp?a=1&b=1&s=612x612&w=0&k=20&c=H6spc1r2plnY6zR3g-_mfj91GJse8hbXg6Er-FmhwoU":v
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type:schema.Types.ObjectId,
        ref:"review",
    }],
    owner:{
        type:schema.Types.ObjectId,
        ref:"user",
    }
   
}, );
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;