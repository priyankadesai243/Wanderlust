const User=require('../models/user.js')

module.exports.rendersignupform=(req, res) =>{
    res.render("./users/signup.ejs");
}

module.exports.signup=async(req, res,next) =>{
    try{
        let { username, email, password }=req.body;
        const newUser=new User({username, email});
        let registeredUser=await User.register(newUser, password);
        req.login(registeredUser, (err) =>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome To Wanderlust!");
            res.redirect("listings")
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.renderloginupform=(req, res) =>{
    res.render("./users/login.ejs");
}

module.exports.login=async(req, res) =>{
    req.flash("success", "Welcome Back To Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        }
        req.flash("success", "Your are Logged Out");
        res.redirect("/listings")
    })
}