const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

const dotenv = require('dotenv');
// Load environment variables early so any code below can read them
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const db_url = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, ReviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Debug: log presence of Cloudinary env vars (avoid printing secrets)
console.log('ENV loaded from', envPath, 'CLOUDINARY_CLOUD_NAME present:', !!process.env.CLOUDINARY_CLOUD_NAME);




app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// Serve uploaded files (multer destination) so image URLs like /uploads/<file> are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const seshStore = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret: env.process.SECRET,
    touchAfter: 24 * 60 * 60
  }
});

const sessionOptions = {
  secret: env.process.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    httpOnly: true,
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000
    
  },
  store : seshStore
}

store.on("error", function(error) {
  console.log( "seshstore error");
})


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Saves user ID in session (cookie)
passport.deserializeUser(User.deserializeUser());//Retrieves user ID from session


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(db_url);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});



app.use((req, res, next) => {
  // expose flash messages as arrays so views can render all messages
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // expose the authenticated user (if any) to all views
  res.locals.currentUser = req.user || null;
  next(); // this middleware exposes flash messages to views
}); // to views via locals

app.get("/demouser",async(req,res)=>{
  let fakeuser = new User({
    email : "gWUoA@example.com",
    username : "demouser",
  })
  let registeredUser = await User.register(fakeuser,"fakepass");
  console.log(registeredUser);
  res.send(registeredUser);
});

// Use the listing routes via Router
const listingRoutes = require("./routes/listing");
app.use("/listings", listingRoutes);

// Use the review routes via Router
const reviewRoutes = require("./routes/review");
app.use("/listings/:id/reviews", reviewRoutes);

const userRoutes = require("./routes/user");
const MongoStore = require("connect-mongo");
app.use("/", userRoutes);







// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// Catch-all route for 404 errors - must be after all other routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error handling middleware - must be last
app.use((err, req, res, next) => {
  // Multer file size error handling (code 'LIMIT_FILE_SIZE')
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    // Provide a friendly message and redirect back
    req.flash('error', `Uploaded file is too large. Maximum allowed size is ${process.env.MAX_UPLOAD_SIZE_BYTES ? process.env.MAX_UPLOAD_SIZE_BYTES : '20MB'}.`);
    // Try to redirect back to the referrer or to the listings page
    const back = req.get('Referrer') || '/listings';
    return res.redirect(back);
  }

  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

