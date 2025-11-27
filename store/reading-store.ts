import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReadingPosition {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
}

interface ReadingStore {
  lastRead: ReadingPosition | null;
  setLastRead: (
    surahNumber: number,
    verseNumber: number,
    surahName: string
  ) => void;
  clearLastRead: () => void;
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set) => ({
      lastRead: null,

      setLastRead: (surahNumber, verseNumber, surahName) => {
        set({
          lastRead: {
            surahNumber,
            verseNumber,
            surahName,
            timestamp: Date.now(),
          },
        });
      },

      clearLastRead: () => {
        set({ lastRead: null });
      },
    }),
    {
      name: "quran-reading-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
