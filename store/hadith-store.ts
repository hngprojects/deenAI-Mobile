import {
  Hadith,
  HadithBook,
  HadithCollection,
  HadithCollectionId,
  HadithDataset,
  HadithState
} from '@/types/hadith.types';
import { create } from 'zustand';

// Import JSON files
const HADITH_DATA = {
  muslim: {
    arabic: require('@/assets/data/hadith/muslim-ara.json') as HadithDataset,
    english: require('@/assets/data/hadith/muslim-eng.json') as HadithDataset,
  },
  bukhari: {
    arabic: require('@/assets/data/hadith/bukhari-ara.json') as HadithDataset,
    english: require('@/assets/data/hadith/bukhari-eng.json') as HadithDataset,
  },
  abudawud: {
    arabic: require('@/assets/data/hadith/abudawud-ara.json') as HadithDataset,
    english: require('@/assets/data/hadith/abudawud-eng.json') as HadithDataset,
  },
  tirmidhi: {
    arabic: require('@/assets/data/hadith/tirmidhi-ara.json') as HadithDataset,
    english: require('@/assets/data/hadith/tirmidhi-eng.json') as HadithDataset,
  },
};

// Collection metadata
const COLLECTIONS: HadithCollection[] = [
  {
    id: 'muslim',
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    description: 'Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)',
    image: require('@/assets/images/muslim.png'),
    color: '#5C3A2E',
    totalHadiths: 0,
  },
  {
    id: 'bukhari',
    name: 'Sahih al-Bukhari',
    arabicName: 'صحيح البخاري',
    description: 'Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)',
    image: require('@/assets/images/bukhari.png'),
    color: '#2C5F4A',
    totalHadiths: 0,
  },
  {
    id: 'abudawud',
    name: 'Sunan Abi Dawud',
    arabicName: 'سنن أبي داود',
    description: 'Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)',
    image: require('@/assets/images/dawud.png'),
    color: '#1E4A7F',
    totalHadiths: 0,
  },
  {
    id: 'tirmidhi',
    name: "Jami' at-Tirmidhi",
    arabicName: 'جامع الترمذي',
    description: 'Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)',
    image: require('@/assets/images/tirmidhi.png'),
    color: '#6B5D3F',
    totalHadiths: 0,
  },
];

// Helper function to organize hadiths into books using metadata
const organizeIntoBooks = (dataset: HadithDataset): HadithBook[] => {
  const books: HadithBook[] = [];
  const { sections, section_details } = dataset.metadata;

  // Group hadiths by book number
  const booksMap = new Map<number, Hadith[]>();

  dataset.hadiths.forEach((hadith) => {
    const bookNum = hadith.reference.book;
    if (!booksMap.has(bookNum)) {
      booksMap.set(bookNum, []);
    }
    booksMap.get(bookNum)!.push(hadith);
  });

  // Create book objects using metadata
  Object.keys(sections).forEach((sectionNum) => {
    const bookNumber = parseInt(sectionNum);
    const bookHadiths = booksMap.get(bookNumber) || [];
    const sectionDetail = section_details[sectionNum];

    if (bookHadiths.length > 0) {
      const sortedHadiths = bookHadiths.sort((a, b) => a.hadithnumber - b.hadithnumber);

      books.push({
        bookNumber,
        book: sections[sectionNum],
        hadiths: sortedHadiths,
        hadithStartNumber: sectionDetail?.hadithnumber_first || sortedHadiths[0].hadithnumber,
        hadithEndNumber: sectionDetail?.hadithnumber_last || sortedHadiths[sortedHadiths.length - 1].hadithnumber,
        arabicStartNumber: sectionDetail?.arabicnumber_first || sortedHadiths[0].arabicnumber,
        arabicEndNumber: sectionDetail?.arabicnumber_last || sortedHadiths[sortedHadiths.length - 1].arabicnumber,
        numberOfHadith: sortedHadiths.length,
      });
    }
  });

  return books.sort((a, b) => a.bookNumber - b.bookNumber);
};

export const useHadithStore = create<HadithState & {
  loadCollection: (collectionId: HadithCollectionId) => Promise<void>;
  setCurrentCollection: (collectionId: HadithCollectionId | null) => void;
  setCurrentBook: (book: HadithBook | null) => void;
  setCurrentHadith: (hadithNumber: number | null) => void;
  setLanguage: (language: 'english' | 'arabic' | 'both') => void;
  getBooksByCollection: (collectionId: HadithCollectionId) => HadithBook[];
  getHadithByNumber: (collectionId: HadithCollectionId, hadithNumber: number, lang: 'arabic' | 'english') => Hadith | null;
  getCollectionMetadata: (collectionId: HadithCollectionId, lang: 'arabic' | 'english') => any;
}>((set, get) => ({
  collections: COLLECTIONS,
  currentCollection: null,
  currentBook: null,
  currentHadith: null,
  language: 'both',
  loadedData: {},
  isLoading: false,
  error: null,

  loadCollection: async (collectionId: HadithCollectionId) => {
    const state = get();

    // Check if already loaded
    if (state.loadedData[collectionId]) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = HADITH_DATA[collectionId];
      const arabicDataset: HadithDataset = data.arabic;
      const englishDataset: HadithDataset = data.english;

      // Organize into books using English metadata (structure is the same)
      const books = organizeIntoBooks(englishDataset);

      set((state) => ({
        loadedData: {
          ...state.loadedData,
          [collectionId]: {
            arabic: arabicDataset,
            english: englishDataset,
            books,
          },
        },
        isLoading: false,
        collections: state.collections.map(c =>
          c.id === collectionId
            ? { ...c, totalHadiths: englishDataset.hadiths.length }
            : c
        ),
      }));
    } catch (error) {
      console.error('Error loading collection:', error);
      set({
        isLoading: false,
        error: `Failed to load ${collectionId} collection`
      });
    }
  },

  setCurrentCollection: (collectionId) => set({ currentCollection: collectionId }),

  setCurrentBook: (book) => set({ currentBook: book }),

  setCurrentHadith: (hadithNumber) => set({ currentHadith: hadithNumber }),

  setLanguage: (language) => set({ language }),

  getBooksByCollection: (collectionId) => {
    const data = get().loadedData[collectionId];
    return data?.books || [];
  },

  getHadithByNumber: (collectionId, hadithNumber, lang) => {
    const data = get().loadedData[collectionId];
    if (!data) return null;

    const hadiths = lang === 'arabic' ? data.arabic.hadiths : data.english.hadiths;
    return hadiths.find(h => h.hadithnumber === hadithNumber) || null;
  },

  getCollectionMetadata: (collectionId, lang) => {
    const data = get().loadedData[collectionId];
    if (!data) return null;

    return lang === 'arabic' ? data.arabic.metadata : data.english.metadata;
  },
}));