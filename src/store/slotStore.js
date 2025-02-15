import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export const useSlotStore = create(
  persist(
    (set, get) => ({
      users: {},
      selectedUser: null,
      copiedSlots: { slots: [], username: null },
      
      addSlot: (date, timeSlot, username) => {
        set((state) => {
          if (!username) return state;

          const newUsers = { ...state.users };
          
          if (!newUsers[username]) {
            newUsers[username] = { slots: {} };
          }
          
          const dateKey = format(date, 'yyyy-MM-dd');
          if (!newUsers[username].slots[dateKey]) {
            newUsers[username].slots[dateKey] = [];
          }
          
          if (!newUsers[username].slots[dateKey].includes(timeSlot)) {
            newUsers[username].slots[dateKey] = [
              ...newUsers[username].slots[dateKey],
              timeSlot
            ];
          }
          
          return { users: newUsers };
        });
      },
      
      removeSlot: (date, timeSlot, username) => {
        set((state) => {
          if (!username) return state;

          const newUsers = { ...state.users };
          const dateKey = format(date, 'yyyy-MM-dd');
          
          if (newUsers[username]?.slots[dateKey]) {
            newUsers[username].slots[dateKey] = newUsers[username].slots[dateKey]
              .filter(slot => slot !== timeSlot);
          }
          
          return { users: newUsers };
        });
      },

      copySlots: (date) => {
        const state = get();
        const dateKey = format(date, 'yyyy-MM-dd');
        const username = state.selectedUser || state.user?.username;
        
        if (username && state.users[username]?.slots[dateKey]) {
          set({
            copiedSlots: {
              slots: [...state.users[username].slots[dateKey]],
              username
            }
          });
        }
      },

      pasteSlots: (date, username) => {
        const state = get();
        if (!state.copiedSlots.slots.length) return;

        const dateKey = format(date, 'yyyy-MM-dd');
        set((state) => {
          const newUsers = { ...state.users };

          if (!newUsers[username]) {
            newUsers[username] = { slots: {} };
          }

          const existingSlots = newUsers[username].slots[dateKey] || [];
          newUsers[username].slots[dateKey] = [
            ...new Set([...existingSlots, ...state.copiedSlots.slots])
          ];
          
          return { users: newUsers };
        });
      },

      addUser: (username) => {
        set((state) => ({
          users: {
            ...state.users,
            [username]: state.users[username] || { 
              slots: {},
              bio: '',
              preferences: {
                notifications: true,
                emailUpdates: true
              }
            }
          }
        }));
      },

      setSelectedUser: (username) => set({ selectedUser: username }),

      getUserSlots: (username) => {
        const state = get();
        return state.users[username]?.slots || {};
      }
    }),
    {
      name: 'slot-storage',
      partialize: (state) => ({
        users: state.users
      })
    }
  )
);
