import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow Three.js to work with Next.js App Router
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Turbopack config removed to prevent outputFileTracingRoot conflict on Vercel

  // Allow images from the Express backend and Cloudinary
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '8080' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
    ],
  },
}

export default nextConfig
