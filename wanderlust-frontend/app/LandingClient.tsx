'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, Suspense, useState } from 'react';
import type { Listing, CategoryStat } from '@/types/listing';
import ListingCard from '@/components/Listings/ListingCard';
import VibeSearch from '@/components/AI/VibeSearch';
import { Globe2, Waves, Flame, BedDouble, Building2, TreePine, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// Dynamic import Globe — no SSR (Three.js needs browser)
const GlobeScene = dynamic(() => import('@/components/Globe/GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="globe-loader">
      <div className="globe-loader__ring" />
    </div>
  ),
});

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Trending:  <Flame size={22} />,
  Rooms:     <BedDouble size={22} />,
  Penthouse: <Building2 size={22} />,
  Beaches:   <Waves size={22} />,
  Cabins:    <TreePine size={22} />,
};

interface LandingClientProps {
  featuredListings: Listing[];
  allListings: Listing[];
  categories: CategoryStat[];
}

export default function LandingClient({
  featuredListings,
  allListings,
  categories,
}: LandingClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? allListings.filter((l) => l.category === activeCategory)
    : allListings;

  // GSAP scroll animation — lazy loaded
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Section headers reveal
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
              },
            }
          );
        });

        // Staggered cards
        gsap.utils.toArray<HTMLElement>('.card-stagger').forEach((container) => {
          const cards = container.querySelectorAll<HTMLElement>('.listing-card, .category-pill');
          gsap.fromTo(cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
              },
            }
          );
        });

        // Hero text animation
        gsap.fromTo('.hero-headline',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
        );
        gsap.fromTo('.hero-sub',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
        );
        gsap.fromTo('.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 }
        );
      });

      cleanup = () => ctx.revert();
    })();

    return () => { cleanup?.(); };
  }, []);

  return (
    <main>
      {/* ── STAR BACKGROUND ── */}
      <div className="star-field" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="hero" className="hero-section">
        {/* Globe canvas */}
        <div className="globe-canvas-wrapper">
          <Suspense fallback={<div className="globe-loader"><div className="globe-loader__ring" /></div>}>
            <GlobeScene listings={featuredListings} />
          </Suspense>
        </div>

        {/* Gradient overlay so text is readable over globe */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(6,8,13,0.1) 0%, rgba(6,8,13,0.65) 70%, rgba(6,8,13,0.92) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Hero text */}
        <div className="hero-content" style={{ zIndex: 2 }}>
          <div className="label-sm mb-4 hero-headline" style={{ opacity: 0 }}>
            <Globe2 size={12} style={{ display: 'inline', marginRight: 6 }} />
            {featuredListings.length} destinations across the world
          </div>
          <h1
            className="display-xl hero-headline mb-4"
            style={{ opacity: 0, maxWidth: '800px', margin: '0 auto 20px' }}
          >
            The world is<br />
            <span className="text-gradient-purple">yours to explore</span>
          </h1>
          <p
            className="hero-sub text-lg mb-8"
            style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 32px', opacity: 0 }}
          >
            Immersive travel discovery powered by AI. Spin the globe, click a pin, fall in love.
          </p>
          <div className="hero-cta flex items-center justify-center gap-4 flex-wrap" style={{ opacity: 0 }}>
            <Link href="/listings" className="btn-primary">
              Browse Listings
            </Link>
            <a href="#ai-search" className="btn-ghost">
              ✨ AI Curator
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, opacity: 0.5, animation: 'float 3s ease-in-out infinite',
          }}
        >
          <span className="label-sm">Scroll to explore</span>
          <ChevronDown size={16} style={{ color: 'var(--primary)' }} />
        </div>
      </section>

      <hr className="glow-line" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          CATEGORIES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="categories" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="section-header text-center reveal">
            <div className="label-sm mb-3">Browse by vibe</div>
            <h2 className="display-md">
              What kind of stay are you<br />
              <span className="text-gradient-purple">dreaming about?</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 card-stagger">
            {/* All button */}
            <button
              className={`category-pill ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              <span className="icon">🌍</span>
              <span className="label">All</span>
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                {allListings.length}
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`category-pill ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              >
                <span className="icon">{CATEGORY_ICONS[cat.name]}</span>
                <span className="label">{cat.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="glow-line" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          LISTINGS GRID
      ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="explore" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="section-header reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="label-sm mb-2">
                {activeCategory ? `${activeCategory} listings` : 'All destinations'}
              </div>
              <h2 className="display-md">
                {filtered.length}{' '}
                <span className="text-gradient-purple">
                  {filtered.length === 1 ? 'place' : 'places'}
                </span>{' '}
                await
              </h2>
            </div>
            <Link href="/listings" className="btn-ghost" style={{ marginBottom: 8 }}>
              View all listings →
            </Link>
          </div>

          {filtered.length > 0 ? (
            <div
              className="grid card-stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {filtered.slice(0, 12).map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <p className="text-lg mb-2">No listings yet in this category.</p>
              <Link href="/listings/new" className="btn-primary" style={{ display: 'inline-flex' }}>
                Create one
              </Link>
            </div>
          )}
        </div>
      </section>

      <hr className="glow-line" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          AI VIBE SEARCH
      ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <VibeSearch listings={allListings} />

      <hr className="glow-line" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-padding text-center">
        <div className="container mx-auto px-6">
          <div className="reveal">
            <div className="label-sm mb-4">Ready to host?</div>
            <h2 className="display-lg mb-6">
              Share your world with<br />
              <span className="text-gradient-gold">travellers who care</span>
            </h2>
            <Link
              href="/listings/new"
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '16px 40px' }}
            >
              List your property →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '32px 0',
          textAlign: 'center',
          color: 'var(--text-faint)',
          fontSize: 13,
        }}
      >
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Wanderlust · Built by Faiz Jamal</p>
          <p className="mt-1" style={{ color: 'var(--text-faint)', fontSize: 11 }}>
            Classic listings at{' '}
            <Link href="/listings" style={{ color: 'var(--primary)' }}>
              /listings
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
