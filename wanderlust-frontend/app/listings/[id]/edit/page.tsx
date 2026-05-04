import { getListing } from '@/lib/api';
import ListingForm from '@/components/Listings/ListingForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Edit Listing' };
}

export default async function EditListingPage({ params }: Props) {
  let listing;
  try {
    listing = await getListing(params.id);
  } catch {
    notFound();
  }

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="star-field" />
      <div className="container mx-auto px-6 max-w-3xl relative z-10 animate-revealUp">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Update Your Listing
        </h1>
        <p className="text-white/60 mb-8">
          Make changes to your property details and aesthetic.
        </p>

        <div className="glass-card p-8">
          <ListingForm isEdit={true} initialData={listing} />
        </div>
      </div>
    </main>
  );
}
