const express=require("express");
const router=express.Router({mergeParams:true});
const user=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");
//signupform
router.get("/signup",userController.signupForm);
//signup post
router.post("/signup",wrapAsync(userController.signupPost));
//loginForm
router.get("/login",userController.loginForm);
//loginPost
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:("/login"),
    failureFlash: true,
}),(wrapAsync(userController.loginPost)));
//logout
router.get("/logout",userController.logout);

module.exports=router;