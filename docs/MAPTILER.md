MapTiler setup

This project supports MapTiler maps and geocoding for listings. Follow these steps to enable maps:

1. Create an account at https://cloud.maptiler.com and create an API key.
2. Add the key to your project's `.env` file:

   MAPTILER_API_KEY=your_maptiler_key_here

3. Restart the server. When a listing has a `location` string, the server will try to geocode it during create/update and store the coordinates in `listing.geometry.coordinates` as `[lng, lat]`.

Notes:
- If the API key is missing, geocoding will fail and the map will not render. The app will log a warning.
- The show page renders a MapLibre map using MapTiler tiles when `listing.geometry.coordinates` exist.
- For privacy or quota concerns, consider caching geocodes or pre-populating coordinates.
