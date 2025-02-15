import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSlotStore } from './slotStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      existingUsers: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      login: (username) => {
        set((state) => ({
          isAuthenticated: true,
          user: { username },
          existingUsers: state.existingUsers.includes(username)
            ? state.existingUsers
            : [...state.existingUsers, username]
        }));
        useSlotStore.getState().addUser(username);
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      setTimezone: (timezone) => set({ timezone }),
      deleteUser: (username) => {
        set((state) => ({
          existingUsers: state.existingUsers.filter(user => user !== username)
        }));
        if (get().user?.username === username) {
          set({ isAuthenticated: false, user: null });
        }
        useSlotStore.getState().deleteUser(username);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        existingUsers: state.existingUsers,
        timezone: state.timezone
      })
    }
  )
);