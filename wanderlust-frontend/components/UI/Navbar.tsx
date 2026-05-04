'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, LayoutGrid, Compass } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/Auth/AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [checkAuth]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            boxShadow: '0 0 20px rgba(177,151,252,0.35)',
          }}
        >
          <Compass size={18} color="#fff" />
        </div>
        <span
          className="font-display font-semibold text-lg tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Wanderlust
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/listings">Listings</NavLink>
        <NavLink href="/#explore">Explore</NavLink>
        <NavLink href="/#ai-search">AI Curator</NavLink>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Hi, <span style={{ color: 'var(--primary)' }}>{user.username}</span>
            </span>
            <Link
              href="/listings/new"
              className="btn-ghost text-sm max-md:!hidden"
              style={{ padding: '8px 16px' }}
            >
              Add Listing
            </Link>
            <button
              onClick={async () => {
                const { logout } = await import('@/lib/api');
                await logout();
                await checkAuth();
              }}
              className="btn-primary text-sm"
              style={{ padding: '8px 16px', background: 'rgba(255,100,100,0.1)', color: '#ff6b6b' }}
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn-ghost text-sm max-md:!hidden"
              style={{ padding: '8px 20px' }}
            >
              Sign in
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn-primary text-sm"
              style={{ padding: '8px 20px' }}
            >
              Get started
            </button>
          </>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors duration-200"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
    >
      {children}
    </Link>
  );
}
