const Review = require('../models/review');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, 'Listing not found');
  const newReview = new Review(req.body.review);
  if (req.user && req.user._id) newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Review added');
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted');
  res.redirect(`/listings/${id}`);
};
