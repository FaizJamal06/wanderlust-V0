const https = require('https');
const qs = require('querystring');
require('dotenv').config();

const MAPTILER_KEY = process.env.MAPTILER_API_KEY;

if (!MAPTILER_KEY) {
  console.warn('MAPTILER_API_KEY not set in environment. Geocoding will fail until you add it.');
}

function geocode(address) {
  return new Promise((resolve, reject) => {
    if (!MAPTILER_KEY) return reject(new Error('MAPTILER_API_KEY not configured'));
    const q = qs.stringify({ key: MAPTILER_KEY, q: address, limit: 1 });
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?${q}`;
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (!parsed || !parsed.features || parsed.features.length === 0) {
              return resolve(null);
            }
            const feature = parsed.features[0];
            // MapTiler returns [lon, lat]
            const [lng, lat] = feature.center || [];
            resolve({ lat, lng, raw: feature });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', (err) => reject(err));
  });
}

module.exports = { geocode };