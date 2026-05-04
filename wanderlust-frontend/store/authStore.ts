import { create } from 'zustand';
import { getCurrentUser } from '@/lib/api';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  checkAuth: async () => {
    try {
      const { user } = await getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Failed to check auth:', error);
      set({ user: null, isLoading: false });
    }
  },
}));
