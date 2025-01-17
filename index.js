const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};
const mongo_Url=process.env.MONGO_URL;
const MongoStore = require('connect-mongo');


const ExpressError=require("./utils/ExpressError.js");


const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");
const users=require("./routes/users.js");

const store=MongoStore.create({
    mongoUrl:mongo_Url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo session store",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
const mongoUrl=
main().then(()=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_Url);
};
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use((req,res,next)=>{
    req.time=new Date(Date.now()).toString();
    console.log(req.method,req.path,req.time);
    next();
});

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
app.get("/demoUser",async(req,res)=>{
    let fakeUser=new user({
        email:"student2@gmail.com",
        username:"delta4student",
    });
    let registereUser=await user.register(fakeUser,"goodpassword");
    res.send(registereUser);
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{err});
    // res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("listening at port 8080");
});


// app.get("/listingTesting",async(req,res)=>{
//     let listing1=await new Listing({
//          title:"beach villa",
//          description:"beach side villa",
//          price:23000,
//          location:"calungate,goa",
//          country:"india",
//      });
//      listing1.save().then((res)=>{
//          console.log(res);
//      }).catch((err)=>{
//          console.log(err);
//      });
//      res.send("website working");
//  });

