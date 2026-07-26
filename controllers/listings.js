const Listing=require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const { category, country } = req.query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (country) {
        const words = country.trim().split(/\s+/);

        filter.$and = words.map((word) => ({
            $or: [
                { title: { $regex: word, $options: "i" } },
                { location: { $regex: word, $options: "i" } },
                { country: { $regex: word, $options: "i" } },
                { category: { $regex: word, $options: "i" } }
            ]
        }));
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        category
    });
};

module.exports.renderNewForm=(req, res) =>{
    res.render("listings/new.ejs");
}

module.exports.showlisting =async (req, res) =>{
    let { id }= req.params;
    let listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    console.log(listing)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.render("listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res) =>{
    // let { title, description, price, location, country}=req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.image={ url, filename };
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}


module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);

    const location = req.body.listing.location;
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: location,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "WanderLust App"
            }
        }
    );
    const data = response.data[0];
    newlisting.geometry = {
        type: "Point",
        coordinates: [
            parseFloat(data.lon),
            parseFloat(data.lat)
        ]
    };

    newlisting.image = { url, filename };
    newlisting.owner = req.user._id;
    await newlisting.save();
    if(response.data.length === 0){
        req.flash("error","Invalid location");
        return res.redirect("/listings/new");
    }
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};
module.exports.editlisting=async (req, res) =>{
    let { id }= req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.render("listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200/");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updatelisting=async (req, res) =>{
    let { id }=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!=="undefined"){
         let url=req.file.path;
    let filename=req.file.filename
    listing.image={ url, filename }
    await listing.save();
    }
   
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroylisting=async (req, res)=>{
    let { id } = req.params;
    let deletechat= await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}
