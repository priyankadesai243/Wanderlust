const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const { listingSchema}=require('../schema.js')
const ExpressError=require('../utils/ExpressError.js');
const Listing=require("../models/listing.js");
const { isLoogedin, isOwner, validateListing }=require("../middleware.js")
const { storage }=require("../cloudConfig.js")
const multer=require("multer");
const upload=multer({storage});

const listingController=require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingController.index) )
.post(isLoogedin, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing))

router.get("/new",isLoogedin, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showlisting))
    .put(isLoogedin, isOwner, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.updatelisting))
    .delete(isLoogedin, isOwner, wrapAsync(listingController.destroylisting))

//EDIT
router.get("/:id/edit", isLoogedin, isOwner, wrapAsync(listingController.editlisting))

module.exports=router;