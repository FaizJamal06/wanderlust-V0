'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { getListings, getCategories } from '@/lib/api';
import type { Listing, CategoryStat, PaginationInfo } from '@/types/listing';
import ListingCard from '@/components/Listings/ListingCard';
import Link from 'next/link';

const CATEGORIES = ['All', 'Trending', 'Rooms', 'Penthouse', 'Beaches', 'Cabins'];

export default function ListingsPage() {
  const [listings, setListings]       = useState<Listing[]>([]);
  const [pagination, setPagination]   = useState<PaginationInfo | null>(null);
  const [loading, setLoading]         = useState(true);
  const [category, setCategory]       = useState('All');
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [page, setPage]               = useState(1);
  const LIMIT = 12;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getListings({
      category: category !== 'All' ? category : undefined,
      q:        debouncedSearch || undefined,
      page,
      limit: LIMIT,
    })
      .then((data) => {
        if (!cancelled) {
          setListings(data.listings);
          setPagination(data.pagination);
        }
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [category, debouncedSearch, page]);

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="star-field" />

      {/* Header */}
      <div
        className="container mx-auto px-6 pt-12 pb-8"
      >
        <div className="reveal" style={{ opacity: 1 }}>
          <div className="label-sm mb-2">All destinations</div>
          <h1 className="display-md mb-2">
            Find your{' '}
            <span className="text-gradient-purple">perfect stay</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {pagination?.total ?? '…'} listings worldwide — browse, filter, discover.
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div
        className="container mx-auto px-6 pb-8"
        style={{ position: 'sticky', top: 72, zIndex: 50, paddingTop: 12, paddingBottom: 12 }}
      >
        <div
          style={{
            background: 'rgba(12,15,24,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search title or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: category === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: category === cat ? 'rgba(177,151,252,0.15)' : 'var(--glass)',
                  color: category === cat ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add listing CTA */}
          <a
            href="http://localhost:8080/listings/new"
            className="btn-primary"
            style={{ padding: '9px 20px', fontSize: 13, marginLeft: 'auto' }}
          >
            + Add Listing
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
            <p className="text-lg mb-2">No listings found.</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {listings.map((l) => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="btn-ghost"
              style={{ padding: '10px 20px', opacity: page <= 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  border: p === page ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: p === page ? 'rgba(177,151,252,0.15)' : 'var(--glass)',
                  color: p === page ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
              className="btn-ghost"
              style={{ padding: '10px 20px', opacity: page >= pagination.totalPages ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
