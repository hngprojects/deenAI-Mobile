// store/hadith-store.ts
import { create } from 'zustand';

interface HadithStore {
  selectedCollection: { id: string; name: string } | null;
  selectedCategory: { id: string; name: string } | null;
  setSelectedCollection: (id: string, name: string) => void;
  setSelectedCategory: (id: string, name: string) => void;
  clearSelection: () => void;
}

export const useHadithStore = create<HadithStore>((set) => ({
  selectedCollection: null,
  selectedCategory: null,
  setSelectedCollection: (id: string, name: string) =>
    set({ selectedCollection: { id, name } }),
  setSelectedCategory: (id: string, name: string) =>
    set({ selectedCategory: { id, name } }),
  clearSelection: () => set({ selectedCollection: null, selectedCategory: null }),
}));