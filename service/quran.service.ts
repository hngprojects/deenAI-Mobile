// service/quran.service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookmarkData, LastReadData, QuranData, QuranSettings, Surah, Verse } from '../types/quran.types';

// Import JSON files
const quranArabicRaw = require('../assets/data/quran-arabic-raw.json');
const quranTranslationRaw = require('../assets/data/quran-translation-raw.json');
const quranTransliterationRaw = require('../assets/data/quran-transliteration-raw.json');

const STORAGE_KEYS = {
    BOOKMARKS: '@quran_bookmarks',
    LAST_READ: '@quran_last_read',
    SETTINGS: '@quran_settings',
    QURAN_DATA_LOADED: '@quran_data_loaded'
};

// Surah metadata (114 surahs)
const SURAH_METADATA: Surah[] = [
    { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
    { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
    { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
    { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
    { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
    { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
    { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
    { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
    { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
    { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
    { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
    { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
    { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
    { number: 14, name: "ابراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
    { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
    { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
    { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
    { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
    { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
    { number: 20, name: "طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
    { number: 21, name: "الأنبياء", englishName: "Al-Anbya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
    { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
    { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
    { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
    { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
    { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
    { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
    { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
    { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
    { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
    { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
    { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
    { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan" },
    { number: 34, name: "سبإ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
    { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan" },
    { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
    { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those Ranges in Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
    { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Saad", numberOfAyahs: 88, revelationType: "Meccan" },
    { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan" },
    { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
    { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan" },
    { number: 42, name: "الشورى", englishName: "Ash-Shuraa", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
    { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan" },
    { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
    { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan" },
    { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan" },
    { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
    { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
    { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
    { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
    { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
    { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
    { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
    { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
    { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
    { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
    { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
    { number: 58, name: "المجادلة", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
    { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan" },
    { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan" },
    { number: 61, name: "الصف", englishName: "As-Saf", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
    { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan" },
    { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
    { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan" },
    { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
    { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
    { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
    { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
    { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan" },
    { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan" },
    { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
    { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
    { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan" },
    { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan" },
    { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
    { number: 76, name: "الانسان", englishName: "Al-Insan", englishNameTranslation: "The Man", numberOfAyahs: 31, revelationType: "Medinan" },
    { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan" },
    { number: 78, name: "النبإ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
    { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan" },
    { number: 80, name: "عبس", englishName: "Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
    { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
    { number: 82, name: "الإنفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
    { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan" },
    { number: 84, name: "الإنشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Sundering", numberOfAyahs: 25, revelationType: "Meccan" },
    { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan" },
    { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan" },
    { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
    { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
    { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
    { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
    { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
    { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
    { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
    { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
    { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
    { number: 96, name: "العلق", englishName: "Al-Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
    { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
    { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan" },
    { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
    { number: 100, name: "العاديات", englishName: "Al-Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan" },
    { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan" },
    { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan" },
    { number: 103, name: "العصر", englishName: "Al-Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan" },
    { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan" },
    { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
    { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
    { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
    { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
    { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
    { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan" },
    { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan" },
    { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
    { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
    { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" }
];

class QuranService {
    private quranData: QuranData | null = null;
    private initialized: boolean = false;

    /**
     * Initialize and load Quran data from local JSON files
     */
    async initialize(): Promise<void> {
        if (this.initialized && this.quranData) {
            return;
        }

        try {
            console.log('🚀 Initializing Quran data...');

            // Debug the structure
            console.log('📊 Arabic data structure:', {
                type: typeof quranArabicRaw,
                hasData: !!quranArabicRaw.data,
                hasSurahs: !!quranArabicRaw.data?.surahs,
                surahsCount: quranArabicRaw.data?.surahs?.length
            });

            const verses: { [surahNumber: number]: Verse[] } = {};

            // Process Arabic data
            if (quranArabicRaw.data?.surahs) {
                quranArabicRaw.data.surahs.forEach((surah: any) => {
                    const surahNumber = surah.number;

                    if (surah.ayahs && Array.isArray(surah.ayahs)) {
                        verses[surahNumber] = surah.ayahs.map((ayah: any) => ({
                            number: ayah.numberInSurah,
                            arabic: ayah.text,
                            translation: this.getTranslation(surahNumber, ayah.numberInSurah),
                            transliteration: this.getTransliteration(surahNumber, ayah.numberInSurah)
                        }));
                    }
                });
            }

            this.quranData = {
                surahs: SURAH_METADATA,
                verses
            };

            this.initialized = true;
            await AsyncStorage.setItem(STORAGE_KEYS.QURAN_DATA_LOADED, 'true');

            console.log('🎉 Quran data loaded successfully!', {
                totalSurahs: Object.keys(verses).length,
                firstSurahVerses: verses[1]?.length,
                sampleVerse: verses[1]?.[0]
            });

        } catch (error) {
            console.error('💥 Error initializing Quran data:', error);
            throw new Error('Failed to load Quran data');
        }
    }

    /**
     * Get translation for a specific verse
     */
    private getTranslation(surahNumber: number, verseNumber: number): string {
        try {
            if (quranTranslationRaw.data?.surahs) {
                const surah = quranTranslationRaw.data.surahs.find((s: any) => s.number === surahNumber);
                if (surah?.ayahs) {
                    const ayah = surah.ayahs.find((a: any) => a.numberInSurah === verseNumber);
                    return ayah?.text || '';
                }
            }
            return '';
        } catch (error) {
            console.warn(`Translation not found for ${surahNumber}:${verseNumber}`);
            return '';
        }
    }

    /**
     * Get transliteration for a specific verse
     */
    private getTransliteration(surahNumber: number, verseNumber: number): string {
        try {
            if (quranTransliterationRaw.data?.surahs) {
                const surah = quranTransliterationRaw.data.surahs.find((s: any) => s.number === surahNumber);
                if (surah?.ayahs) {
                    const ayah = surah.ayahs.find((a: any) => a.numberInSurah === verseNumber);
                    return ayah?.text || '';
                }
            }
            return '';
        } catch (error) {
            console.warn(`Transliteration not found for ${surahNumber}:${verseNumber}`);
            return '';
        }
    }

    /**
     * Get all Surahs
     */
    async getAllSurahs(): Promise<Surah[]> {
        await this.initialize();
        return this.quranData?.surahs || [];
    }

    /**
     * Get specific Surah by number
     */
    async getSurah(surahNumber: number): Promise<Surah | null> {
        await this.initialize();
        return this.quranData?.surahs.find(s => s.number === surahNumber) || null;
    }

    /**
     * Get verses for a specific Surah
     */
    async getSurahVerses(surahNumber: number): Promise<Verse[]> {
        await this.initialize();
        return this.quranData?.verses[surahNumber] || [];
    }

    /**
     * Get specific verse
     */
    async getVerse(surahNumber: number, verseNumber: number): Promise<Verse | null> {
        await this.initialize();
        const verses = this.quranData?.verses[surahNumber];
        return verses?.find(v => v.number === verseNumber) || null;
    }

    /**
     * Search Quran (searches in translation and transliteration)
     */
    async searchQuran(query: string): Promise<{ surah: Surah, verse: Verse }[]> {
        await this.initialize();
        const results: { surah: Surah, verse: Verse }[] = [];
        const lowerQuery = query.toLowerCase();

        if (!this.quranData) return results;

        this.quranData.surahs.forEach(surah => {
            const verses = this.quranData!.verses[surah.number];
            verses?.forEach(verse => {
                if (
                    verse.translation.toLowerCase().includes(lowerQuery) ||
                    verse.transliteration.toLowerCase().includes(lowerQuery) ||
                    verse.arabic.includes(query) // Also search in Arabic
                ) {
                    results.push({ surah, verse });
                }
            });
        });

        return results;
    }

    // ... keep all your existing bookmark, last read, and settings methods the same
    // Bookmarks Management
    async getBookmarks(): Promise<BookmarkData[]> {
        try {
            const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
            return bookmarksJson ? JSON.parse(bookmarksJson) : [];
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    }

    async addBookmark(surahNumber: number, verseNumber: number, surahName: string): Promise<void> {
        try {
            const bookmarks = await this.getBookmarks();
            const exists = bookmarks.some(
                b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
            );

            if (!exists) {
                bookmarks.push({
                    surahNumber,
                    verseNumber,
                    surahName,
                    timestamp: Date.now()
                });
                await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
            }
        } catch (error) {
            console.error('Error adding bookmark:', error);
            throw error;
        }
    }

    async removeBookmark(surahNumber: number, verseNumber: number): Promise<void> {
        try {
            const bookmarks = await this.getBookmarks();
            const filtered = bookmarks.filter(
                b => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
            );
            await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error removing bookmark:', error);
            throw error;
        }
    }

    async isBookmarked(surahNumber: number, verseNumber: number): Promise<boolean> {
        const bookmarks = await this.getBookmarks();
        return bookmarks.some(
            b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
        );
    }

    // Last Read Management
    async getLastRead(): Promise<LastReadData | null> {
        try {
            const lastReadJson = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ);
            return lastReadJson ? JSON.parse(lastReadJson) : null;
        } catch (error) {
            console.error('Error getting last read:', error);
            return null;
        }
    }

    async setLastRead(surahNumber: number, verseNumber: number, surahName: string): Promise<void> {
        try {
            const lastRead: LastReadData = {
                surahNumber,
                verseNumber,
                surahName,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(lastRead));
        } catch (error) {
            console.error('Error setting last read:', error);
            throw error;
        }
    }

    // Settings Management
    async getSettings(): Promise<QuranSettings> {
        try {
            const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
            const defaultSettings: QuranSettings = {
                arabicFontSize: 24,
                translationFontSize: 16,
                showTransliteration: true,
                showTranslation: true
            };
            return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
        } catch (error) {
            console.error('Error getting settings:', error);
            return {
                arabicFontSize: 24,
                translationFontSize: 16,
                showTransliteration: true,
                showTranslation: true
            };
        }
    }

    async updateSettings(settings: Partial<QuranSettings>): Promise<void> {
        try {
            const currentSettings = await this.getSettings();
            const updatedSettings = { ...currentSettings, ...settings };
            await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }
}

export const quranService = new QuranService();