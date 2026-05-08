'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing, updateListing } from '@/lib/api';
import type { Listing } from '@/types/listing';
import { Loader2 } from 'lucide-react';

interface ListingFormProps {
  initialData?: Listing;
  isEdit?: boolean;
}

export default function ListingForm({ initialData, isEdit }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [category, setCategory] = useState(initialData?.category || 'Trending');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('country', country);
    formData.append('category', category);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageLink && !isEdit) {
      formData.append('image', imageLink);
    }

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateListing(initialData._id, formData);
      } else {
        res = await createListing(formData);
      }
      
      if (res.success) {
        router.push(`/listings/${res.listing._id}`);
        router.refresh(); // clear Next.js cache
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all"
            placeholder="e.g. Minimalist Beachfront Villa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Description</label>
          <textarea
            required
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
            placeholder="Describe the experience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Price (per night)</label>
          <input
            type="number"
            required
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all"
            placeholder="e.g. 2500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Category</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-all [&>option]:bg-[#0c0f18] [&>option]:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            {['Trending', 'Rooms', 'Penthouse', 'Beaches', 'Cabins', 'Farms', 'Lakes'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Location</label>
          <input
            type="text"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all"
            placeholder="e.g. Calangute, Goa"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Country</label>
          <input
            type="text"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all"
            placeholder="e.g. India"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Image Upload</label>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all"
              onChange={(e) => {
                if (e.target.files?.[0]) setImageFile(e.target.files[0]);
              }}
            />
            {!imageFile && !isEdit && (
              <>
                <span className="text-xs text-white/40 text-center uppercase tracking-widest">or</span>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Paste an image URL..."
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            boxShadow: '0 4px 15px rgba(100,228,204,0.2)'
          }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : (isEdit ? 'Save Changes' : 'Publish Listing')}
        </button>
      </div>
    </form>
  );
}
