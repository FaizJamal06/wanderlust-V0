

# Wanderlust — Airbnb Clone (Express + EJS)

**Live Demo:** [wanderlustv0.onrender.com/listings](https://wanderlustv0.onrender.com/listings)

---

## Overview

**Wanderlust** is a full-stack web application inspired by Airbnb, built using **Express**, **EJS**, and **MongoDB**.
It allows users to browse, create, and manage travel listings around the world.

Key features include:

* **Dual Interface:** Serves classic EJS templates and provides a robust JSON API for the [Next.js immersive frontend](../wanderlust-frontend).
* User authentication (Passport.js)
* Image uploads with Cloudinary + Multer fallback
* Map display and geocoding with MapTiler
* Input validation using Joi
* MongoDB-backed session storage
* Category and location-based filters (client- and server-side)
* MVC architecture with modular routing and middleware

---

## Tech Stack

| Layer                   | Technology                           |
| ----------------------- | ------------------------------------ |
| **Frontend**            | EJS templates, Bootstrap, Vanilla JS |
| **Backend**             | Node.js, Express.js                  |
| **Database**            | MongoDB (Mongoose ODM)               |
| **Authentication**      | Passport.js (Local strategy)         |
| **Image Uploads**       | Multer + Cloudinary                  |
| **Mapping & Geocoding** | MapTiler API                         |
| **Validation**          | Joi                                  |
| **Session Store**       | express-session + connect-mongo      |
| **Hosting**             | Render                               |

---

## Project Structure

```
wanderlust/
│
├── app.js                 # Application entry point
├── package.json
│
├── /models                # Mongoose models (User, Listing, Review)
├── /routes                # Express routers
├── /controllers           # Controller logic
├── /middleware            # Custom middleware (auth, validation)
├── /views                 # EJS templates (layouts, partials, pages)
│   ├── listings/
│   ├── users/
│   ├── reviews/
│   └── partials/
│
├── /public                # Static assets (CSS, JS, images)
├── /utils                 # Helpers (MapTiler config, error handling)
├── /uploads               # Local image storage (fallback)
└── /seeds                 # Sample data for development
```

---

## Features

### Listings

* CRUD operations for listings
* Cloudinary image storage with Multer fallback
* Category filters (Beaches, Cabins, Rooms, Trending, etc.)
* Integrated MapTiler map with location markers

### Authentication

* Secure registration and login via Passport.js
* Session management stored in MongoDB
* Flash messages for feedback

### Reviews

* Authenticated users can create, edit, and delete reviews
* Listings and reviews linked using Mongoose population

### Validation & Error Handling

* Joi validation for all user inputs
* Centralized Express error handling

### Maps

* MapTiler geocoding for listing locations
* Interactive maps embedded on listing pages

---

## MVC Architecture

The project follows a loose **Model–View–Controller** pattern:

* **Models:** Define schemas for Listings, Users, and Reviews
* **Views:** EJS templates rendered on the server
* **Controllers:** Contain logic for routes and CRUD operations
* **Middleware:** Handles authentication, validation, and errors

---

## Database

Wanderlust uses **MongoDB** as its primary database.
Session data is also persisted in MongoDB using `connect-mongo`.
Seed scripts are available for populating the database with sample data.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/wanderlust.git
cd wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloud_key
CLOUDINARY_SECRET=your_cloud_secret
MAPTILER_API_KEY=your_maptiler_api_key
MONGO_URI=mongodb+srv://your_connection_string
SESSION_SECRET=your_secret_key
```

### 4. Start the server

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Deployment

The project is deployed on **Render**, including the Node.js server and MongoDB Atlas database.
You can deploy your own instance by connecting your GitHub repository to Render and setting the required environment variables.

---

## Future Enhancements

* User profile pages
* Booking/reservation system
* Email verification and password reset
* Pagination and infinite scroll
* Dark mode support

---

## Author

**Faiz Jamal**
Student Developer | Full-Stack Enthusiast | ML
🔗 [Live App](https://wanderlustv0.onrender.com/listings)

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute it with attribution.

---
