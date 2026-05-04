const express = require('express');
// mergeParams true so this router can read the :id param from the parent mount
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ReviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, checkReviewAuthor } = require('../utils/middleware');
const reviewController = require('../controllers/reviews');

const validationReviewMiddleware = (req, res, next) => {
  const result = ReviewSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  }
  next();
};


//reviews route 

//post route to handle review creation

// Mounted at /listings/:id/reviews in app.js
router.post("/", isLoggedIn, validationReviewMiddleware, wrapAsync(reviewController.createReview));

//delete route to handle review deletion

router.delete("/:reviewId", isLoggedIn, checkReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;