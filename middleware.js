const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const { listingSchema}=require('./schema.js')
const {reviewSchema }=require('./schema.js')
const ExpressError=require('./utils/ExpressError.js');


module.exports.isLoogedin=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl
        req.flash("error", "You must be logged in to Create a Listing")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveredirecturl=(req, res, next) =>{
    if(req.session.redirecturl){
        res.locals.redirectUrl=req.session.redirecturl;
    }
    next();
}

module.exports.isOwner= async (req, res, next) =>{
    let { id }=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isAuthor= async (req, res, next) =>{
    let { id, reviewId }=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};