const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { geocode } = require("../utils/maptiler");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  const q = req.query.q && String(req.query.q).trim();
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, parseInt(req.query.limit || '9', 10)); // default 9 per page

  let filter = {};
  if (category) filter.category = category;
  if (q) {
    // simple case-insensitive substring search on title or location
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: re }, { location: re }];
  }

  const total = await Listing.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const skip = (page - 1) * limit;

  const allListings = await Listing.find(filter).skip(skip).limit(limit);
  res.render("listings/index.ejs", {
    allListings,
    activeCategory: category || null,
    pagination: { page, limit, total, totalPages }
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res, next) => {
  let { id } = req.params;
  console.log("Fetching listing with ID:", id);
  // populate reviews and their authors, plus owner
  const listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  // Debug: log image info so we can see what's stored and what URL will be used in the view
  const resolvedImageUrl = listing.image && listing.image.url ? listing.image.url : (listing.image && listing.image.filename ? '/uploads/' + listing.image.filename : null);
  console.log('SHOW listing.image raw:', listing.image);
  console.log('SHOW resolved image URL:', resolvedImageUrl);
  console.log("Found listing:", listing._id, listing.title);
  console.log("Number of reviews:", listing.reviews.length);
  if (listing.reviews.length > 0) {
    console.log("Sample review:", listing.reviews[0]);
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createlisting = async (req, res) => {
  console.log('CREATE listing - req.file:', req.file);
  console.log('CREATE listing - req.body keys:', Object.keys(req.body));
  // Support multipart form fields named like listing[title] when using multer
  let listingData = req.body.listing;
  if (!listingData) {
    // reconstruct listing object from bracketed fields: listing[field]
    listingData = {};
    for (const key of Object.keys(req.body)) {
      const m = key.match(/^listing\[(.+)\]$/);
      if (m) listingData[m[1]] = req.body[key];
    }
  }
  const newListing = new Listing(listingData);
  // attach uploaded file info (multer)
  if (req.file) {
    // Support both local-disk multer and Cloudinary adapter outputs.
    // Prefer Cloudinary fields when present; for disk storage build a /uploads/<filename> URL
    let filename = req.file.public_id || req.file.filename || '';
    let fileUrl = '';
    // If this is multer diskStorage (destination is present), use the uploads static route
    if (req.file && req.file.destination && filename) {
      fileUrl = '/uploads/' + filename;
    } else {
      // Cloudinary or other adapter: try common URL fields
      fileUrl = req.file.path || req.file.secure_url || req.file.url || '';
      if (typeof fileUrl === 'string') fileUrl = fileUrl.replace(/\\/g, '/');
    }
    newListing.image = { url: fileUrl, filename };
    console.log('CREATE listing - saved image url:', newListing.image.url, 'filename:', newListing.image.filename);
  }
  newListing.owner = req.user._id;
  // Try to geocode the provided location to get coordinates (non-blocking failure)
  try {
    const address = newListing.location;
    if (address) {
      const geo = await geocode(address);
      if (geo && typeof geo.lng === 'number' && typeof geo.lat === 'number') {
        newListing.geometry = { type: 'Point', coordinates: [geo.lng, geo.lat] };
        console.log('CREATE listing - geocoded coords:', newListing.geometry.coordinates);
      }
    }
  } catch (err) {
    console.warn('Geocoding failed during create:', err && err.message ? err.message : err);
  }
  await newListing.save();
  req.flash("success","created listing listing");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, 'Listing not found');
  }
  res.render('listings/edit.ejs', { listing });
};

module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;
  let listingData = req.body.listing;
  if (!listingData) {
    listingData = {};
    for (const key of Object.keys(req.body)) {
      const m = key.match(/^listing\[(.+)\]$/);
      if (m) listingData[m[1]] = req.body[key];
    }
  }
  // attach uploaded file if present
  if (req.file) {
    let filename = req.file.public_id || req.file.filename || '';
    let fileUrl = '';
    if (req.file && req.file.destination && filename) {
      fileUrl = '/uploads/' + filename;
    } else {
      fileUrl = req.file.path || req.file.secure_url || req.file.url || '';
      if (typeof fileUrl === 'string') fileUrl = fileUrl.replace(/\\/g, '/');
    }
    listingData.image = { url: fileUrl, filename };
    console.log('UPDATE listing - saved image url:', listingData.image.url, 'filename:', listingData.image.filename);
    // Attempt geocoding for updated location as well
    try {
      const address = listingData.location;
      if (address) {
        const geo = await geocode(address);
        if (geo && typeof geo.lng === 'number' && typeof geo.lat === 'number') {
          listingData.geometry = { type: 'Point', coordinates: [geo.lng, geo.lat] };
          console.log('UPDATE listing - geocoded coords:', listingData.geometry.coordinates);
        }
      }
    } catch (err) {
      console.warn('Geocoding failed during update:', err && err.message ? err.message : err);
    }
  }
  const listing = await Listing.findByIdAndUpdate(id, { ...listingData });
  if (!listing) {
    throw new ExpressError(404, 'Listing not found');
  }
  req.flash('success', 'Listing updated successfully');
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, 'Listing not found');
  }
  req.flash('success', 'Listing deleted');
  res.redirect('/listings');
};
