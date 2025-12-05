import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReadingPosition {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
  page?: number; //  page number for read mode
}

interface ReadingStore {
  lastRead: ReadingPosition | null;
  lastReadPage: number | null; // Track last page in read mode
  isReadMode: boolean; // Toggle between list and read mode

  setLastRead: (
    surahNumber: number,
    verseNumber: number,
    surahName: string,
    page?: number
  ) => void;
  clearLastRead: () => void;
  setLastReadPage: (page: number) => void;
  setReadMode: (isReadMode: boolean) => void;
  toggleReadMode: () => void;
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set, get) => ({
      lastRead: null,
      lastReadPage: null,
      isReadMode: false,

      setLastRead: (surahNumber, verseNumber, surahName, page) => {
        set({
          lastRead: {
            surahNumber,
            verseNumber,
            surahName,
            timestamp: Date.now(),
            page,
          },
        });
      },

      clearLastRead: () => {
        set({ lastRead: null, lastReadPage: null });
      },

      setLastReadPage: (page) => {
        set({ lastReadPage: page });
      },

      setReadMode: (isReadMode) => {
        set({ isReadMode });
      },

      toggleReadMode: () => {
        set({ isReadMode: !get().isReadMode });
      },
    }),
    {
      name: "quran-reading-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
