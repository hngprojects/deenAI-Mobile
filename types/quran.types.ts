export interface Verse {
    number: number;
    arabic: string;
    translation: string;
    transliteration: string;
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: 'Meccan' | 'Medinan';
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