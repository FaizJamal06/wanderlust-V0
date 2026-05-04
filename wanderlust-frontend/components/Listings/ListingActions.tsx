'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { deleteListing } from '@/lib/api';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  listingId: string;
  ownerId: string;
}

export default function ListingActions({ listingId, ownerId }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user || user._id !== ownerId) return null;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(listingId);
        router.push('/listings');
        router.refresh();
      } catch (err) {
        console.error(err);
        alert('Failed to delete listing.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
      <Link
        href={`/listings/${listingId}/edit`}
        className="btn-ghost flex justify-center items-center gap-2 w-full py-3"
      >
        <Pencil size={16} /> Edit Listing
      </Link>
      <button
        onClick={handleDelete}
        className="btn-ghost flex justify-center items-center gap-2 w-full py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
      >
        <Trash2 size={16} /> Delete Listing
      </button>
    </div>
  );
}
