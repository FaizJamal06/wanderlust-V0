# 🌐 Wanderlust — Immersive Frontend

This is the immersive, high-performance frontend for **Wanderlust**, built with **Next.js 15+** and **Three.js**.

## 🚀 Key Features

- **Interactive 3D Globe:** Explore destinations globally through a cinematic 3D interface.
- **AI Curator:** Discover your next stay using natural language "vibe" searches powered by Groq.
- **High-End Animations:** Seamless user experience with GSAP and Framer Motion transitions.
- **Zustand State:** Lightweight and reactive state management for auth and UI.
- **Glassmorphic UI:** Modern, premium design system using Tailwind CSS 4.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **3D Engine:** `@react-three/fiber`, `@react-three/drei`, `three`
- **Animations:** `gsap`, `framer-motion`
- **Icons:** `lucide-react`
- **Styling:** `tailwindcss` v4

## 📦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Ensure `NEXT_PUBLIC_API_URL` is set in `.env.local` to point to your backend.

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔗 Backend

This frontend communicates with the [Wanderlust Backend](../wanderlust-V0) API.
