const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.renderreviewform=async (req, res) =>{
    let { id }=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/review.ejs",{ listing });
}

module.exports.createreview=async (req, res) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Added!")
    res.redirect(`/listings/${id}`);
}

module.exports.deletReview=async (req, res)=>{
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
}