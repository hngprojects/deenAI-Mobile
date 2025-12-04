import { create } from "zustand";

interface Bookmark {
  surahNumber: number;
  verseNumber?: number; // optional
}

interface BookmarkState {
  bookmarks: Bookmark[];

  addBookmark: (surahNumber: number, verseNumber?: number) => void;
  removeBookmark: (surahNumber: number) => void;

  isBookmarked: (surahNumber: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],

  addBookmark: (surahNumber, verseNumber) => {
    const existing = get().bookmarks.find(
      (b) => b.surahNumber === surahNumber
    );

    // prevent duplicates
    if (existing) return;

    set((state) => ({
      bookmarks: [
        ...state.bookmarks,
        { surahNumber, verseNumber: verseNumber || 1 },
      ],
    }));
  },

  removeBookmark: (surahNumber) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (b) => b.surahNumber !== surahNumber
      ),
    }));
  },

  isBookmarked: (surahNumber) => {
    return get().bookmarks.some((b) => b.surahNumber === surahNumber);
  },
}));
