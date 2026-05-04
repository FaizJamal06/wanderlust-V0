const Joi = require('joi');

// This is the Joi schema for validating a listing submission
// It matches the structure of the data sent by your HTML form
// The form uses names like `listing[title]`, `listing[description]`,
// which creates a nested object under `req.body.listing` in Express.

const ListingSchema = Joi.object({
  // The top-level key `listing` matches the HTML form's `listing[...]` inputs
  listing: Joi.object({
    // `title` must be a string between 2 and 100 characters, and it is required
    title: Joi.string().min(2).max(100).required(),

    // `description` must be a string of at least 10 characters, required
    description: Joi.string().min(10).required(),

    // `location` must be a non-empty string, required
    location: Joi.string().required(),

    // `country` must be a non-empty string, required
    country: Joi.string().required(),

    // `price` must be a number >= 0, required
    price: Joi.number().min(0).required(),

    // `image` must be a string (URL or uploaded filepath). For uploads we accept any non-empty string.
    image: Joi.string().required(),
    // category must be one of the allowed enums
    category: Joi.string().valid('Trending', 'Rooms', 'Penthouse', 'Beaches', 'Cabins').required()
  }).required() // The nested `listing` object itself is required
  // This ensures the user actually submitted a listing object
});

// Export the schema for use in your routes
// Example usage in your POST route:
// const { error } = ListingSchema.validate(req.body);
// If `error` exists, you can handle it (e.g., send back a validation message)

const ReviewSchema = Joi.object({
  review : Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).required()
  }).required()
});

// Export both schemas
module.exports = { ListingSchema, ReviewSchema };