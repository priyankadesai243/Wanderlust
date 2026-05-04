if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require('express');
const app=express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session')
const MongoStore = require("connect-mongo");
const flash=require('connect-flash')
const passport=require("passport");
const LocalStrategy=require("passport-local");
const mongoose=require('mongoose');
const dbUrl=process.env.ATLASDB_URL;

const User=require("./models/user.js");
const ExpressError=require('./utils/ExpressError.js');

const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

console.log(process.env.ATLASDB_URL)
main()
    .then(() =>{
        console.log("connection sucessfu");
    })  
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    cryptoAdapter: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error", ()=>{
    console.log("error in mongo session store");
})

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() +1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    }
};

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})

app.get("/", (req,res) =>{
    res.render("root");
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req, res, next) =>{
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    let { statusCode=500, message="Something Error Occured"}=err
    res.status(statusCode).render("error.ejs", { message });
})



app.listen(3030, (req,res) =>{    
    console.log("server is listening to port");
});
