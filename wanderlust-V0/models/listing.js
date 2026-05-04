const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url : String,
    filename : String
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  // GeoJSON point for map coordinates
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      // [longitude, latitude]
      type: [Number],
    }
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type : Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: 
    {
      type : Schema.Types.ObjectId,
      ref: "User"
    },

    category: 
    {
      type : String,
      enum : ['Trending', 'Rooms', 'Penthouse', 'Beaches', 'Cabins'],
      default: 'Trending',
      index: true // add index for faster category queries
      
    }
  
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
