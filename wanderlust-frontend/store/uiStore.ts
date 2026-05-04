import { create } from 'zustand';

type Mode = 'explore' | 'classic';

interface UIStore {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  cursorVariant: 'default' | 'hover' | 'drag';
  setCursorVariant: (v: 'default' | 'hover' | 'drag') => void;
  globeLoaded: boolean;
  setGlobeLoaded: (v: boolean) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mode: 'explore',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'explore' ? 'classic' : 'explore' })),
  cursorVariant: 'default',
  setCursorVariant: (cursorVariant) => set({ cursorVariant }),
  globeLoaded: false,
  setGlobeLoaded: (globeLoaded) => set({ globeLoaded }),
  selectedListingId: null,
  setSelectedListingId: (selectedListingId) => set({ selectedListingId }),
}));
