import type { Metadata } from 'next';
import { getFeaturedListings, getListings, getCategories } from '@/lib/api';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Wanderlust — Immersive Travel Experiences',
  description:
    'Discover extraordinary places to stay around the world. Explore our curated listings through an immersive 3D globe and AI-powered travel recommendations.',
  openGraph: {
    title: 'Wanderlust — Immersive Travel Experiences',
    description: 'Premium travel listings with AI-powered discovery.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function HomePage() {
  // Fetch data server-side — fails gracefully with empty arrays
  const [featuredListings, allData, categories] = await Promise.all([
    getFeaturedListings().catch(() => []),
    getListings({ limit: 40 }).catch(() => ({ listings: [], pagination: { page:1, limit:40, total:0, totalPages:0 } })),
    getCategories().catch(() => []),
  ]);

  return (
    <LandingClient
      featuredListings={featuredListings}
      allListings={allData.listings}
      categories={categories}
    />
  );
}
