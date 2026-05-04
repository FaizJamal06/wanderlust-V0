// Shared middleware utilities
const Listing = require('../models/listing');
const ExpressError = require('./ExpressError');
const Review = require('../models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated){
    req.session.redirecturl = req.originalUrl;
  };
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash('error', 'You must be signed in to do that');
  return res.redirect('/login');
};

module.exports.saveredirecturl = (req,res,next)=>{
  res.locals.redirectUrl = req.session.originalUrl;
  next();
}

// Middleware to ensure the current user is the owner of a listing
module.exports.checkListingOwner = async (req, res, next) => {
  const { id } = req.params;
  if (!req.user) {
    req.flash('error', 'You must be signed in to do that');
    return res.redirect('/login');
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError(404, 'Listing not found'));
  }
  const ownerId = listing.owner && listing.owner._id ? listing.owner._id : listing.owner;
  const userId = req.user._id;
  const isOwner = (ownerId && userId && typeof userId.equals === 'function')
    ? userId.equals(ownerId)
    : String(userId) === String(ownerId);
  if (!isOwner) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

// Middleware to ensure the current user is the author of a review
module.exports.checkReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  if (!req.user) {
    req.flash('error', 'You must be signed in to do that');
    return res.redirect('/login');
  }
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ExpressError(404, 'Review not found'));
  }
  const authorId = review.author;
  const userId = req.user._id;
  const isAuthor = (authorId && userId && typeof userId.equals === 'function')
    ? userId.equals(authorId)
    : String(userId) === String(authorId);
  if (!isAuthor) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/listings/${id}`);
  }
  return next();
};