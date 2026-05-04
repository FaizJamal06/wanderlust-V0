const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { upload } = require('../cloudconfig');
const { geocode } = require('../utils/maptiler');

// ==========================================
// HEALTH CHECK
// ==========================================
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// API-SPECIFIC MIDDLEWARES
// ==========================================
const apiIsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'You must be signed in to do that' });
};

const apiCheckListingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const ownerId = listing.owner && listing.owner._id ? listing.owner._id : listing.owner;
  const userId = req.user._id;
  const isOwner = (ownerId && userId && typeof userId.equals === 'function')
    ? userId.equals(ownerId)
    : String(userId) === String(ownerId);
  if (!isOwner) return res.status(403).json({ error: 'You do not have permission to do that' });
  return next();
};

const apiCheckReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  const authorId = review.author;
  const userId = req.user._id;
  const isAuthor = (authorId && userId && typeof userId.equals === 'function')
    ? userId.equals(authorId)
    : String(userId) === String(authorId);
  if (!isAuthor) return res.status(403).json({ error: 'You do not have permission to do that' });
  return next();
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// GET /api/auth/me
router.get('/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
  } else {
    res.json({ user: null });
  }
});

// POST /api/auth/signup
router.post('/auth/signup', wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already taken' });
    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already registered' });
    
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.json({ success: true, user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email } });
    });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Something went wrong' });
  }
}));

// POST /api/auth/login
router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message || 'Invalid username or password' });
    
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, user: { _id: user._id, username: user.username, email: user.email } });
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

// ==========================================
// LISTING READ ROUTES
// ==========================================

router.get('/listings', wrapAsync(async (req, res) => {
  const { category, q, limit = 20, page = 1 } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (q) {
    const re = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: re }, { location: re }, { country: re }];
  }

  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const pageNum = Math.max(1, parseInt(page, 10));
  const skip = (pageNum - 1) * limitNum;

  const [listings, total] = await Promise.all([
    Listing.find(filter).skip(skip).limit(limitNum).lean(),
    Listing.countDocuments(filter),
  ]);

  res.json({
    listings,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}));

router.get('/listings/featured', wrapAsync(async (req, res) => {
  const listings = await Listing.find({
    'geometry.coordinates': { $exists: true, $not: { $size: 0 } },
  })
    .limit(20)
    .lean();
  res.json(listings);
}));

router.get('/listings/:id', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author', select: 'username' } })
    .populate('owner', 'username')
    .lean();

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
}));

router.get('/categories', wrapAsync(async (req, res) => {
  const cats = ['Trending', 'Rooms', 'Penthouse', 'Beaches', 'Cabins'];
  const counts = await Promise.all(
    cats.map(async (cat) => ({
      name: cat,
      count: await Listing.countDocuments({ category: cat }),
    }))
  );
  res.json(counts);
}));

// ==========================================
// LISTING MUTATION ROUTES
// ==========================================

router.post('/listings', apiIsLoggedIn, upload.single('image'), wrapAsync(async (req, res) => {
  // Try to read listing data from req.body (for JSON) or req.body.listing (for multipart)
  let listingData = req.body.listing;
  if (!listingData && req.body) {
    // If sent as FormData without nested keys
    listingData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
      category: req.body.category
    };
  }
  
  if (!listingData || !listingData.title) {
    return res.status(400).json({ error: 'Invalid listing data' });
  }

  const newListing = new Listing(listingData);
  
  if (req.file) {
    let filename = req.file.public_id || req.file.filename || '';
    let fileUrl = '';
    if (req.file && req.file.destination && filename) {
      fileUrl = '/uploads/' + filename;
    } else {
      fileUrl = req.file.path || req.file.secure_url || req.file.url || '';
      if (typeof fileUrl === 'string') fileUrl = fileUrl.replace(/\\/g, '/');
    }
    newListing.image = { url: fileUrl, filename };
  } else if (req.body.image) {
    // Fallback if an image URL is sent directly
    newListing.image = { url: req.body.image, filename: 'link' };
  }

  newListing.owner = req.user._id;

  try {
    const address = newListing.location;
    if (address) {
      const geo = await geocode(address);
      if (geo && typeof geo.lng === 'number' && typeof geo.lat === 'number') {
        newListing.geometry = { type: 'Point', coordinates: [geo.lng, geo.lat] };
      }
    }
  } catch (err) {
    console.warn('Geocoding failed via API:', err.message);
  }

  await newListing.save();
  res.status(201).json({ success: true, listing: newListing });
}));

router.put('/listings/:id', apiIsLoggedIn, apiCheckListingOwner, upload.single('image'), wrapAsync(async (req, res) => {
  const { id } = req.params;
  let listingData = req.body.listing || req.body;
  
  // Create object to update to avoid overwriting un-passed fields
  const updateData = { ...listingData };
  delete updateData.image; // handle image separately

  if (req.file) {
    let filename = req.file.public_id || req.file.filename || '';
    let fileUrl = '';
    if (req.file && req.file.destination && filename) {
      fileUrl = '/uploads/' + filename;
    } else {
      fileUrl = req.file.path || req.file.secure_url || req.file.url || '';
      if (typeof fileUrl === 'string') fileUrl = fileUrl.replace(/\\/g, '/');
    }
    updateData.image = { url: fileUrl, filename };
  } else if (req.body.image) {
     updateData.image = { url: req.body.image, filename: 'link' };
  }

  if (updateData.location) {
    try {
      const geo = await geocode(updateData.location);
      if (geo && typeof geo.lng === 'number' && typeof geo.lat === 'number') {
        updateData.geometry = { type: 'Point', coordinates: [geo.lng, geo.lat] };
      }
    } catch (err) {}
  }

  const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
  res.json({ success: true, listing });
}));

router.delete('/listings/:id', apiIsLoggedIn, apiCheckListingOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  res.json({ success: true, deletedListing });
}));

// ==========================================
// REVIEW MUTATION ROUTES
// ==========================================

router.post('/listings/:id/reviews', apiIsLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  // Handle both { review: { rating, comment } } and { rating, comment }
  const reviewData = req.body.review || req.body;
  if (!reviewData || !reviewData.rating || !reviewData.comment) {
     return res.status(400).json({ error: 'Rating and comment are required' });
  }

  const newReview = new Review(reviewData);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  // Populate author before returning so frontend can display username
  await newReview.populate('author', 'username');

  res.status(201).json({ success: true, review: newReview });
}));

router.delete('/listings/:id/reviews/:reviewId', apiIsLoggedIn, apiCheckReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ success: true });
}));

module.exports = router;
