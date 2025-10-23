const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn, checkListingOwner } = require('../utils/middleware');
const listingController = require('../controllers/listings');
const { upload } = require('../cloudconfig');

//Listing Routes
const validationListingMiddleware = (req, res, next) => {
  // Ensure req.body.listing exists for multipart/form-data where fields may be bracketed
  if (!req.body.listing) {
    req.body.listing = {};
    for (const key of Object.keys(req.body)) {
      const m = key.match(/^listing\[(.+)\]$/);
      if (m) req.body.listing[m[1]] = req.body[key];
    }
  }
  // If multer provided a file, inject its path as the image field so Joi validation passes
  if (req.file) {
    req.body.listing.image = req.file.path || '';
  }
  const result = ListingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  }
  next();
};

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm );

//Show Route
router.get("/:id", wrapAsync(listingController.show));

//Create Route
// Order: isLoggedIn -> multer -> validation -> controller
router.post(
  "/",
  isLoggedIn,
  upload.single('listing[image]'),
  validationListingMiddleware,
  wrapAsync(listingController.createlisting)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, checkListingOwner, wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, checkListingOwner, upload.single('listing[image]'), wrapAsync(listingController.updatelisting));

//Delete Route
router.delete("/:id", isLoggedIn, checkListingOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
