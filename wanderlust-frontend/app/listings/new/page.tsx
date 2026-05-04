import type { Metadata } from 'next';
import ListingForm from '@/components/Listings/ListingForm';

export const metadata: Metadata = {
  title: 'Create a Listing',
};

export default function NewListingPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="star-field" />
      <div className="container mx-auto px-6 max-w-3xl relative z-10 animate-revealUp">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Curate a New Experience
        </h1>
        <p className="text-white/60 mb-8">
          Share your extraordinary space with the Wanderlust community.
        </p>

        <div className="glass-card p-8">
          <ListingForm isEdit={false} />
        </div>
      </div>
    </main>
  );
}
