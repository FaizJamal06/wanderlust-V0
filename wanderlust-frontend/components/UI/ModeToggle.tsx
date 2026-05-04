'use client';

import { useUIStore } from '@/store/uiStore';

export default function ModeToggle() {
  const { mode, setMode } = useUIStore();

  return (
    <div className="mode-toggle">
      <button
        className={`mode-toggle__btn ${mode === 'explore' ? 'active' : ''}`}
        onClick={() => setMode('explore')}
        aria-label="Switch to Explore mode"
      >
        Explore
      </button>
      <button
        className={`mode-toggle__btn ${mode === 'classic' ? 'active' : ''}`}
        onClick={() => setMode('classic')}
        aria-label="Switch to Classic mode"
      >
        Classic
      </button>
    </div>
  );
}
