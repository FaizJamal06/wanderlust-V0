'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { Listing } from '@/types/listing';
import { getImageUrl } from '@/lib/api';
import { useUIStore } from '@/store/uiStore';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const setCursor = useUIStore((s) => s.setCursorVariant);

  return (
    <Link
      href={`/listings/${listing._id}`}
      className="listing-card block"
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="listing-card__img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(listing)}
          alt={listing.title}
          loading="lazy"
        />
        <span className="listing-card__badge">{listing.category}</span>
      </div>
      <div className="listing-card__body">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-semibold text-sm leading-tight"
            style={{ color: 'var(--text)' }}
          >
            {listing.title}
          </h3>
        </div>
        <div
          className="flex items-center gap-1 text-xs mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          <MapPin size={10} />
          {listing.location}, {listing.country}
        </div>
        <div className="flex items-center justify-between">
          <p className="listing-card__price">
            ₹{listing.price.toLocaleString()}
            <span> /night</span>
          </p>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: 'rgba(177,151,252,0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(177,151,252,0.2)',
            }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
