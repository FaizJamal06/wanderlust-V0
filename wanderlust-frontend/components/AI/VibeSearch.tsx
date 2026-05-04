'use client';

import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import type { Listing, AIRecommendation } from '@/types/listing';
import { getImageUrl } from '@/lib/api';
import Link from 'next/link';

interface VibeSearchProps {
  listings: Listing[];
}

export default function VibeSearch({ listings }: VibeSearchProps) {
  const [vibe, setVibe]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<Array<Listing & { reason: string }>>([]);
  const [error, setError]       = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const suggest = async () => {
    if (!vibe.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe, listings }),
      });

      if (!res.ok) throw new Error('AI service error');

      const data = await res.json();
      const recs: AIRecommendation[] = data.recommendations ?? [];

      const matched = recs
        .map((r) => {
          const l = listings.find((x) => x._id === r.id);
          return l ? { ...l, reason: r.reason } : null;
        })
        .filter(Boolean) as Array<Listing & { reason: string }>;

      setResults(matched);
      setHasSearched(true);
    } catch {
      setError('Could not reach AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exampleVibes = [
    'Peaceful mountain retreat with fireplace',
    'Vibrant city nightlife and rooftop views',
    'Secluded beach, hammock, no WiFi',
    'Luxury penthouse with infinity pool',
  ];

  return (
    <section id="ai-search" className="section-padding" style={{ position: 'relative' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="section-header text-center">
          <div className="label-sm mb-3 flex items-center justify-center gap-2">
            <Sparkles size={12} style={{ color: 'var(--primary)' }} />
            AI Travel Curator
          </div>
          <h2 className="display-lg mb-4">
            Describe your{' '}
            <span className="text-gradient-purple">perfect escape</span>
          </h2>
          <p className="vibe-subtitle" style={{ color: 'var(--text-muted)' }}>
            Tell our AI the vibe you&apos;re chasing — sunset, silence, chaos, luxury — and
            it will curate the ideal destinations from our collection.
          </p>
        </div>

        {/* Input */}
        <div className="vibe-input-wrapper">
          <input
            type="text"
            className="vibe-input"
            placeholder="e.g. &quot;Misty mountains, warm cabin, complete silence…&quot;"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && suggest()}
            disabled={loading}
          />
          <button className="vibe-btn" onClick={suggest} disabled={loading} aria-label="Search">
            {loading
              ? <Loader2 size={18} color="#fff" className="animate-spin" />
              : <Send size={18} color="#fff" />
            }
          </button>
        </div>




        {/* Error */}
        {error && (
          <p className="text-center mt-4 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
        )}

        {/* Results */}
        {hasSearched && results.length > 0 && (
          <div className="mt-14">
            <p className="label-sm text-center mb-8">Curated for you</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((listing, i) => (
                <div
                  key={listing._id}
                  className="glass-card overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(listing)}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                    <div
                      style={{
                        position: 'absolute', top: 10, left: 10,
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: '#fff', borderRadius: 999, padding: '3px 10px',
                        fontSize: 11, fontWeight: 700,
                      }}
                    >
                      #{i + 1} Pick
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div className="label-sm mb-1">{listing.category}</div>
                    <div className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>
                      {listing.title}
                    </div>
                    <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      📍 {listing.location}, {listing.country}
                    </div>
                    {/* AI reason */}
                    <div
                      className="text-sm italic mb-4"
                      style={{
                        color: 'var(--accent)',
                        borderLeft: '2px solid var(--accent)',
                        paddingLeft: 10,
                        opacity: 0.85,
                      }}
                    >
                      &ldquo;{listing.reason}&rdquo;
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
                        ₹{listing.price.toLocaleString()}
                        <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/night</span>
                      </span>
                      <Link
                        href={`/listings/${listing._id}`}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 13 }}
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasSearched && results.length === 0 && !error && (
          <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            No matches found. Try a different vibe — or add more listings to the platform!
          </p>
        )}
      </div>
    </section>
  );
}
