const express=require('express');
const router=express.Router({mergeParams: true});
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema }=require('../schema.js')
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoogedin, isAuthor, validateReview}=require("../middleware.js")
const reviewController=require("../controllers/review.js")

router.route("/")
    .get(wrapAsync(reviewController.renderreviewform))
    .post(isLoogedin, validateReview, wrapAsync(reviewController.createreview));

router.delete("/:reviewId", isLoogedin, isAuthor, wrapAsync(reviewController.deletReview))

module.exports=router;
