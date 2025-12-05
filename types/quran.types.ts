export interface Verse {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
  page?: number; // Add page number
  juz?: number;
  manzil?: number;
  ruku?: number;
  hizbQuarter?: number;
  numberInSurah?: number;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface QuranData {
  surahs: Surah[];
  verses: {
    [surahNumber: number]: Verse[];
  };
}

export interface BookmarkData {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
}

export interface LastReadData {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
}

export interface QuranSettings {
  arabicFontSize: number;
  translationFontSize: number;
  showTransliteration: boolean;
  showTranslation: boolean;
}

export interface PageVerse {
  surahNumber: number;
  verseNumber: number;
  text: string;
  numberInSurah: number;
}

export interface QuranPage {
  pageNumber: number;
  verses: PageVerse[];
}

export interface ReadModePosition {
  pageNumber: number;
  timestamp: number;
}
