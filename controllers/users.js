const user=require("../models/user.js");

module.exports.signupForm=(req,res)=>{
    res.render("./users/signUp.ejs");
};
module.exports.signupPost=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new user({username,email});
    let registeredUser=await user.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","New User Registered!!");
        res.redirect("/listings");
    });
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs");
};
module.exports.loginPost=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    if(res.locals.redirectUrl){res.redirect(res.locals.redirectUrl);}
    else{
        res.redirect("/listings");
    }
};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    });
    req.flash("success","You Logged Out successfully");
    res.redirect("/listings");
};