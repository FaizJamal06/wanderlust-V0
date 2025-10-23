const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Attempt to geocode each sample listing's location and attach geometry
  const { geocode } = require('../utils/maptiler');
  let geocodedCount = 0;
  for (const listing of initData.data) {
    try {
      const geo = await geocode(listing.location);
      if (geo && typeof geo.lng === 'number' && typeof geo.lat === 'number') {
        listing.geometry = { type: 'Point', coordinates: [geo.lng, geo.lat] };
        geocodedCount++;
      }
    } catch (err) {
      console.warn('Geocoding failed for', listing.location, '-', err && err.message ? err.message : err);
      // continue without geometry
    }
  }
  await Listing.insertMany(initData.data);
  console.log(`data was initialized. Geocoded ${geocodedCount}/${initData.data.length} listings.`);
};

initDB();
