import type { Metadata } from 'next';
import { getListing, getImageUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import { MapPin, Star, Calendar, User, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ReviewSection from '@/components/Listings/ReviewSection';
import ListingActions from '@/components/Listings/ListingActions';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const listing = await getListing(params.id);
    return {
      title: `${listing.title} — ${listing.location}`,
      description: listing.description.slice(0, 160),
    };
  } catch {
    return { title: 'Listing' };
  }
}

export default async function ListingDetailPage({ params }: Props) {
  let listing;
  try {
    listing = await getListing(params.id);
  } catch {
    notFound();
  }

  const imgSrc = getImageUrl(listing);
  const avgRating = listing.reviews?.length
    ? listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
    : null;

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="star-field" />

      <div className="container mx-auto px-6 py-12" style={{ maxWidth: '1100px' }}>

        {/* Back */}
        <Link
          href="/listings"
          className="flex items-center gap-2 mb-8 text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
        >
          <ArrowLeft size={15} />
          Back to listings
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

          {/* ── Hero image ── */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              aspectRatio: '16/7',
              border: '1px solid var(--border)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(6,8,13,0.8) 0%, transparent 50%)',
              }}
            />
            {/* Overlaid info */}
            <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: '#fff',
                  borderRadius: 999, padding: '4px 12px',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                }}
              >
                {listing.category}
              </span>
              <h1
                className="font-display"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}
              >
                {listing.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <MapPin size={13} />
                {listing.location}, {listing.country}
              </div>
            </div>
          </div>

          {/* ── Content grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

            {/* Left: About + Reviews */}
            <div>
              {/* Stats row */}
              <div
                className="glass-card"
                style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 32, flexWrap: 'wrap' }}
              >
                {avgRating !== null && (
                  <StatItem icon={<Star size={16} style={{ color: 'var(--gold)' }} />} label="Rating" value={`${avgRating.toFixed(1)} / 5`} />
                )}
                <StatItem icon={<User size={16} style={{ color: 'var(--primary)' }} />} label="Host" value={listing.owner?.username ?? 'Unknown'} />
                <StatItem icon={<MapPin size={16} style={{ color: 'var(--accent)' }} />} label="Location" value={`${listing.location}, ${listing.country}`} />
                {listing.reviews && (
                  <StatItem icon={<Calendar size={16} style={{ color: 'var(--primary)' }} />} label="Reviews" value={String(listing.reviews.length)} />
                )}
              </div>

              {/* Description */}
              <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
                <h2
                  className="font-display text-xl font-semibold mb-4"
                  style={{ color: 'var(--text)' }}
                >
                  About this place
                </h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>
                  {listing.description}
                </p>
              </div>

              {/* Reviews */}
              <ReviewSection listingId={listing._id} reviews={listing.reviews || []} />
            </div>

            {/* Right: Booking card */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div
                className="glass-card"
                style={{ padding: '28px', boxShadow: 'var(--shadow-glow-purple)' }}
              >
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontSize: 28, fontWeight: 800, color: 'var(--text)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    ₹{listing.price.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 4 }}>/night</span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}
                    onClick={() => alert("Booking functionality coming soon!")}
                  >
                    Reserve
                  </button>
                </div>

                {/* Listing Management Actions (Client Component) */}
                <ListingActions 
                  listingId={listing._id} 
                  ownerId={String(listing.owner?._id || listing.owner || '')} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
      </div>
    </div>
  );
}
