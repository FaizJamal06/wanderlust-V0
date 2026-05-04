const sampleListings = [
  {
    "title": "Giraffe Manor",
    "description": "An exclusive boutique hotel in Nairobi where resident Rothschild's giraffes join you for breakfast, poking their long necks through the windows.",
    "price": 900,
    "location": "Nairobi",
    "country": "Kenya",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924262/Wanderlust_Dev/mw35c4y6eiot1ndiothz.jpg",
      "filename": "Wanderlust_Dev/mw35c4y6eiot1ndiothz"
    }
  },
  {
    "title": "The Muraka Underwater Suite",
    "description": "A first-of-its-kind luxury residence in the Maldives, featuring a master bedroom completely submerged 16 feet below sea level in the Indian Ocean.",
    "price": 50000,
    "location": "Conrad Maldives Rangali Island",
    "country": "Maldives",
    "category": "Penthouse",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924263/Wanderlust_Dev/rbvun6gikhcxxf3prskd.jpg",
      "filename": "Wanderlust_Dev/rbvun6gikhcxxf3prskd"
    }
  },
  {
    "title": "Amangiri Resort",
    "description": "A secluded ultra-luxury retreat tucked into the dramatic canyons of the American Southwest, offering modernist architecture blending into the rocks.",
    "price": 3500,
    "location": "Canyon Point, Utah",
    "country": "United States",
    "category": "Rooms",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924264/Wanderlust_Dev/ipuxzpdcdmks1tii3klx.jpg",
      "filename": "Wanderlust_Dev/ipuxzpdcdmks1tii3klx"
    }
  },
  {
    "title": "Burj Al Arab Royal Suite",
    "description": "Often called the world's most luxurious hotel, this sail-shaped icon offers duplex suites with 24-carat gold iPads, private butlers, and unmatched opulence.",
    "price": 24000,
    "location": "Dubai",
    "country": "United Arab Emirates",
    "category": "Penthouse",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924265/Wanderlust_Dev/pn8cjukkfpyljwgvldg4.jpg",
      "filename": "Wanderlust_Dev/pn8cjukkfpyljwgvldg4"
    }
  },
  {
    "title": "Kakslauttanen Arctic Resort",
    "description": "Sleep under the Northern Lights in these iconic thermal glass igloos, surrounded by the magical snow-covered forests of Finnish Lapland.",
    "price": 800,
    "location": "Saariselkä",
    "country": "Finland",
    "category": "Cabins",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924267/Wanderlust_Dev/xni01uwvj6m0lb22n7jx.jpg",
      "filename": "Wanderlust_Dev/xni01uwvj6m0lb22n7jx"
    }
  },
  {
    "title": "Hobbiton Movie Set",
    "description": "Experience the magic of Middle-earth by staying near the rolling green hills and charming hobbit holes of the actual Shire movie set.",
    "price": 450,
    "location": "Matamata",
    "country": "New Zealand",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924268/Wanderlust_Dev/bibu3oswlsqyhq37ch9f.jpg",
      "filename": "Wanderlust_Dev/bibu3oswlsqyhq37ch9f"
    }
  },
  {
    "title": "Soneva Jani Overwater Villas",
    "description": "Massive overwater villas featuring retractable roofs for stargazing and private water slides that plunge directly into the sparkling lagoon.",
    "price": 4500,
    "location": "Noonu Atoll",
    "country": "Maldives",
    "category": "Beaches",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924270/Wanderlust_Dev/dswdyvojpc0astvqfsbp.jpg",
      "filename": "Wanderlust_Dev/dswdyvojpc0astvqfsbp"
    }
  },
  {
    "title": "Skylodge Adventure Suites",
    "description": "For the adventurous only: transparent luxury capsules hanging 1,200 feet up a sheer cliff face. Accessible only by climbing or ziplining.",
    "price": 400,
    "location": "Sacred Valley",
    "country": "Peru",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924271/Wanderlust_Dev/em72dy0y7rshta3v80yj.jpg",
      "filename": "Wanderlust_Dev/em72dy0y7rshta3v80yj"
    }
  },
  {
    "title": "Icehotel Jukkasjärvi",
    "description": "The world's first hotel made entirely of ice and snow, rebuilt from scratch every winter with incredible ice sculptures.",
    "price": 600,
    "location": "Jukkasjärvi",
    "country": "Sweden",
    "category": "Cabins",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924272/Wanderlust_Dev/uwkzbe82kevz6flmgjzf.jpg",
      "filename": "Wanderlust_Dev/uwkzbe82kevz6flmgjzf"
    }
  },
  {
    "title": "Treehotel Mirrorcube",
    "description": "A striking, mirrored box suspended in the tall pines of a Swedish forest, reflecting the surrounding trees and perfectly camouflaging into nature.",
    "price": 550,
    "location": "Harads",
    "country": "Sweden",
    "category": "Cabins",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924273/Wanderlust_Dev/m7emiod2nn4oo2xlvjip.jpg",
      "filename": "Wanderlust_Dev/m7emiod2nn4oo2xlvjip"
    }
  },
  {
    "title": "Villa d'Este",
    "description": "A legendary 16th-century princely residence turned luxury hotel, renowned for its magnificent gardens right on the shores of Lake Como.",
    "price": 1200,
    "location": "Lake Como",
    "country": "Italy",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924274/Wanderlust_Dev/s8mkydkywtmwan32cjjj.jpg",
      "filename": "Wanderlust_Dev/s8mkydkywtmwan32cjjj"
    }
  },
  {
    "title": "Fogo Island Inn",
    "description": "A striking modernist inn perched on the rugged, remote coast of Newfoundland, offering spectacular ocean views and wild landscapes.",
    "price": 1800,
    "location": "Fogo Island",
    "country": "Canada",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924276/Wanderlust_Dev/mbgwf15vtwfs4vp28pwd.jpg",
      "filename": "Wanderlust_Dev/mbgwf15vtwfs4vp28pwd"
    }
  },
  {
    "title": "Marina Bay Sands",
    "description": "Stay in Singapore's most iconic hotel, famous for its massive ship-shaped rooftop holding the world's largest elevated infinity pool.",
    "price": 950,
    "location": "Marina Bay",
    "country": "Singapore",
    "category": "Penthouse",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924277/Wanderlust_Dev/um5n4agnuqoklyw6b7st.jpg",
      "filename": "Wanderlust_Dev/um5n4agnuqoklyw6b7st"
    }
  },
  {
    "title": "The Plaza Hotel",
    "description": "New York's most famous and historic luxury hotel, located right at the corner of Central Park and Fifth Avenue.",
    "price": 1100,
    "location": "New York City",
    "country": "United States",
    "category": "Rooms",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924278/Wanderlust_Dev/pknhd1e8yqufiubatboz.jpg",
      "filename": "Wanderlust_Dev/pknhd1e8yqufiubatboz"
    }
  },
  {
    "title": "Ashford Castle",
    "description": "Live like royalty in an 800-year-old Irish castle, complete with sprawling grounds, falconry, and medieval architecture.",
    "price": 1300,
    "location": "County Mayo",
    "country": "Ireland",
    "category": "Trending",
    "image": {
      "url": "https://res.cloudinary.com/dkw2idnkk/image/upload/v1777924279/Wanderlust_Dev/rugfxagouehsuptbv3vq.jpg",
      "filename": "Wanderlust_Dev/rugfxagouehsuptbv3vq"
    }
  }
];

// Add owner id to every sample listing (from previous code)
sampleListings.forEach((listing) => {
  listing.owner = '68f462f8a2cfd2dea9919604';
});

module.exports = { data: sampleListings };
