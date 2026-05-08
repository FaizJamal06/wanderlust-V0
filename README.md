# 🧭 Wanderlust — Immersive Travel Discovery

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Three.js](https://img.shields.io/badge/Three.js-Globe-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

**Wanderlust** is a premium, full-stack travel discovery platform that redefines how you explore the world. Beyond a simple listing site, it offers an immersive experience powered by a **3D interactive globe** and **AI-driven travel curation**.

🔗 **Live Demo:** [wanderlustv0.onrender.com](https://wanderlustv0.onrender.com) (Backend/EJS) | *Frontend deployment in progress*

---

## ✨ Features

### 🌍 Immersive Exploration
- **3D Interactive Globe:** Spin the world and discover destinations by clicking interactive pins. Built with **React Three Fiber** and **Three.js**.
- **Cinematic Animations:** Smooth transitions and high-end micro-interactions using **GSAP** and **Framer Motion**.

### 🤖 AI Curator
- **Vibe-based Search:** Don't just search for a city; search for a "vibe" (e.g., "cozy winter retreat with a fireplace").
- **Powered by Groq:** Lightning-fast AI recommendations tailored to your mood and preferences.

### 🏠 Listing Management
- **Full CRUD:** Create, edit, and manage travel listings with ease.
- **Image Hosting:** Seamless image uploads powered by **Cloudinary**.
- **Reviews & Ratings:** Authenticated users can leave feedback and rate their experiences.

### 🔐 Secure & Robust
- **Passport.js Auth:** Secure user registration and session management.
- **Input Validation:** Strict schema validation using **Joi**.
- **Responsive Design:** A glassmorphic, mobile-first UI that looks stunning on any device.

---

## 🛠️ Tech Stack

### Frontend (Next.js)
- **Framework:** Next.js 15+ (App Router)
- **3D Engine:** Three.js, React Three Fiber, @react-three/drei
- **Animations:** GSAP, Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Styling:** Tailwind CSS 4

### Backend (Node.js)
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** Passport.js (Local Strategy)
- **Storage:** Cloudinary API
- **Maps:** MapTiler API

---

## 📂 Project Structure

```text
wanderlustv2/
├── wanderlust-frontend/     # Next.js 15+ Immersive Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # 3D Globe, UI, and AI components
│   ├── lib/                 # API utilities and hooks
│   └── store/               # Zustand state management
├── wanderlust-V0/           # Express.js Backend & API
│   ├── models/              # Mongoose Schemas (User, Listing, Review)
│   ├── routes/              # Express API & EJS routes
│   ├── controllers/         # Business logic
│   └── views/               # EJS templates (Classic version)
└── .env                     # Shared environment variables
```

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/FaizJamal06/wanderlust-V0.git
cd wanderlustv2
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# MongoDB
ATLAS_DB_URL=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# MapTiler & AI
MAPTILER_API_KEY=your_maptiler_key
GROQ_API_KEY=your_groq_key

# Auth
SECRET=your_session_secret
```

### 3. Install & Run (Backend)
```bash
cd wanderlust-V0
npm install
npm start
```

### 4. Install & Run (Frontend)
```bash
cd wanderlust-frontend
npm install
npm run dev
```

---

## 📸 Preview

*(Add your screenshots here)*

---

## 👨‍💻 Author

**Faiz Jamal**
- GitHub: [@FaizJamal06](https://github.com/FaizJamal06)
- Project: Wanderlust V2

---

## ⚖️ License

This project is licensed under the MIT License.
