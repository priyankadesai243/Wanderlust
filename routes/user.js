const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const User=require('../models/user.js')
const passport=require("passport");
const { saveredirecturl }=require("../middleware.js")
const userController=require("../controllers/user.js")

router.route("/signup")
    .get(userController.rendersignupform)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderloginupform)
    
    .post(saveredirecturl, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
    wrapAsync(userController.login));

router.get("/logout", userController.logout)

module.exports=router;