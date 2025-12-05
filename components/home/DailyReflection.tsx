import { quranService } from '@/service/quran.service';
import { useReflectStore } from '@/store/reflect-store';
import { useAuthStore } from '@/store/auth-store'; // Add this import
import { theme } from '@/styles/theme';
import { Verse } from '@/types/quran.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Edit3Icon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// type ContentType = 'quran' | 'hadith';
type ContentType = 'quran'; // Only Quran for now

interface DailyContent {
    type: ContentType;
    verse?: Verse & { surahNumber: number; surahName: string };
    // hadith?: Hadith & { collectionId: string; collectionName: string };
    dayOfYear: number;
}

const STORAGE_KEY = '@daily_reflection_cache';

export default function DailyReflection() {
    const router = useRouter();
    // const { loadCollection, loadedData } = useHadithStore();
    const { setDraft } = useReflectStore();
    const { isGuest } = useAuthStore(); // Add this
    const { t } = useTranslation();

    const [content, setContent] = useState<DailyContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [guestMode, setGuestMode] = useState(false); // Add this

    useEffect(() => {
        loadDailyContent();
    }, []);

    useEffect(() => {
        // Update only after hydration (one render later)
        setGuestMode(isGuest);
    }, [isGuest]);

    const getDayOfYear = (): number => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const loadDailyContent = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const dayOfYear = getDayOfYear();

            // Try to load cached content first
            const cachedContent = await loadCachedContent(dayOfYear);
            if (cachedContent) {
                console.log('✅ Using cached daily content');
                setContent(cachedContent);
                setIsLoading(false);
                return;
            }

            // Only show Quran verses now (removed Hadith alternation)
            // const contentType: ContentType = dayOfYear % 2 === 0 ? 'quran' : 'hadith';
            const contentType: ContentType = 'quran';

            let newContent: DailyContent | null = null;

            // Only load Quran content
            // if (contentType === 'quran') {
            newContent = await loadDailyQuran(dayOfYear);
            // } else {
            //     newContent = await loadDailyHadith(dayOfYear);
            // }

            if (newContent) {
                await cacheContent(newContent);
                setContent(newContent);
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Error loading daily content:', err);
            setError('Failed to load content');
            setIsLoading(false);
        }
    };

    const loadCachedContent = async (dayOfYear: number): Promise<DailyContent | null> => {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEY);
            if (cached) {
                const parsedContent: DailyContent = JSON.parse(cached);
                if (parsedContent.dayOfYear === dayOfYear) {
                    return parsedContent;
                }
            }
        } catch (error) {
            console.error('Error loading cached content:', error);
        }
        return null;
    };

    const cacheContent = async (content: DailyContent): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        } catch (error) {
            console.error('Error caching content:', error);
        }
    };

    const loadDailyQuran = async (dayOfYear: number): Promise<DailyContent | null> => {
        try {
            await quranService.initialize();
            const surahs = await quranService.getAllSurahs();

            if (!surahs || surahs.length === 0) {
                setError('No Qur\'an data available');
                return null;
            }

            const surahIndex = dayOfYear % surahs.length;
            const selectedSurah = surahs[surahIndex];

            const verses = await quranService.getSurahVerses(selectedSurah.number);

            if (!verses || verses.length === 0) {
                setError('No verses available for this surah');
                return null;
            }

            const verseIndex = Math.floor((dayOfYear * 17) % verses.length);
            const selectedVerse = verses[verseIndex];

            if (selectedVerse) {
                return {
                    type: 'quran',
                    verse: {
                        ...selectedVerse,
                        surahNumber: selectedSurah.number,
                        surahName: selectedSurah.englishName,
                    },
                    dayOfYear,
                };
            }
        } catch (err) {
            console.error('Error loading daily Qur\'an:', err);
            setError('Failed to load Qur\'an verse');
        }
        return null;
    };

    // Comment out Hadith loading function
    /*
    const loadDailyHadith = async (dayOfYear: number): Promise<DailyContent | null> => {
        try {
            const collections = [
                { id: 'bukhari' as const, name: 'Sahih al-Bukhari' },
                { id: 'muslim' as const, name: 'Sahih Muslim' },
                { id: 'abudawud' as const, name: 'Sunan Abi Dawud' },
                { id: 'tirmidhi' as const, name: "Jami' at-Tirmidhi" },
            ];

            const collectionIndex = dayOfYear % collections.length;
            const selectedCollection = collections[collectionIndex];

            await loadCollection(selectedCollection.id);

            const collectionData = useHadithStore.getState().loadedData[selectedCollection.id];

            if (!collectionData || !collectionData.english) {
                setError('Failed to load hadith collection');
                return null;
            }

            const hadiths = collectionData.english.hadiths;

            if (!hadiths || hadiths.length === 0) {
                setError('No hadiths available');
                return null;
            }

            const hadithIndex = Math.floor((dayOfYear * 17) % hadiths.length);
            const selectedHadith = hadiths[hadithIndex];

            if (selectedHadith) {
                return {
                    type: 'hadith',
                    hadith: {
                        ...selectedHadith,
                        collectionId: selectedCollection.id,
                        collectionName: selectedCollection.name,
                    },
                    dayOfYear,
                };
            }
        } catch (err) {
            console.error('Error loading daily hadith:', err);
            setError('Failed to load hadith');
        }
        return null;
    };
    */

    const handleReflect = () => {
        if (!content || guestMode) return; // Add guestMode check

        // Only handle Quran content now
        // if (content.type === 'quran' && content.verse) {
        if (content.verse) {
            const verse = content.verse;

            setDraft({
                surahNumber: verse.surahNumber,
                verseNumber: verse.number,
                arabicText: verse.arabic,
                translation: verse.translation,
                surahName: verse.surahName,
            });

            router.push({
                pathname: '/(tabs)/(reflect)/reflect-verse',
                params: {
                    surahNumber: verse.surahNumber.toString(),
                    startAyah: verse.number.toString(),
                    verseText: verse.translation,
                    surahName: verse.surahName,
                },
            } as any);
        }
        // Remove Hadith handling
        /*
        else if (content.type === 'hadith' && content.hadith) {
            const hadith = content.hadith;

            setDraft({
                surahNumber: hadith.hadithnumber,
                verseNumber: hadith.reference.book,
                arabicText: hadith.arabic || '',
                translation: hadith.text,
                surahName: hadith.collectionName,
            });

            router.push({
                pathname: '/(tabs)/(reflect)/reflect-verse',
                params: {
                    surahNumber: hadith.hadithnumber.toString(),
                    startAyah: hadith.reference.book.toString(),
                    verseText: hadith.text,
                    surahName: hadith.collectionName,
                },
            } as any);
        }
        */
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Today&apos;s Reflection</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.color.brand} />
                </View>
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{t("reflectionTitle")}</Text>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error || 'No content available'}
                    </Text>
                </View>
            </View>
        );
    }

    // Always Quran now - remove conditional logic
    // const isQuran = content.type === 'quran';
    const isQuran = true;
    const displayText = content.verse?.translation;
    const sourceInfo = `${content.verse?.surahName} - Verse ${content.verse?.number}`;

    // Truncate text for display
    const MAX_LENGTH = 250;
    const shouldTruncate = (displayText?.length || 0) > MAX_LENGTH;
    const truncatedText = shouldTruncate && !isExpanded
        ? displayText?.substring(0, MAX_LENGTH).trim() + '...'
        : displayText;

    return (
        <View style={styles.container}>

            <View style={styles.card}>
                <Text style={styles.title}>{t("reflectionTitle")}</Text>
                <View style={styles.contentContainer}>
                    <Text style={styles.text}>
                        {truncatedText || ''}
                    </Text>

                    {shouldTruncate && (
                        <TouchableOpacity
                            onPress={() => setIsExpanded(!isExpanded)}
                            style={styles.readMoreButton}
                        >
                            <Text style={styles.readMoreText}>
                                {isExpanded ? 'Read less' : 'Read more'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.referenceRow}>
                        {/* Surah container */}
                        <View style={styles.referenceContainer}>
                            <Text style={styles.referenceText}>({sourceInfo})</Text>
                        </View>

                        {/* Edit button - Add disabled state */}
                        <TouchableOpacity 
                            style={[styles.editContainer, guestMode && styles.editContainerDisabled]}
                            onPress={handleReflect}
                            disabled={guestMode}
                        >
                            <Edit3Icon size={16} color="#F9F9F9" />
                            <Text style={styles.editText}>Reflect</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        color: '#000',
        marginBottom: 16,
        lineHeight: 22,
    },
    loadingContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    errorContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#ebebebff',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150,
    },
    errorText: {
        fontSize: 16,
        color: '#999',
        fontFamily: theme.font.regular,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#ebebebff',
    },
    contentContainer: {
        marginBottom: 24,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    text: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
        marginBottom: 12,
        // textAlign: 'center',
        fontFamily: theme.font.semiBold,
    },
    readMoreButton: {
        alignSelf: 'center',
        marginBottom: 8,
    },
    readMoreText: {
        fontSize: 14,
        color: theme.color.brand,
        fontFamily: theme.font.semiBold,
    },
    referenceContainer: {
        borderRadius: 35,
        backgroundColor: '#FFF4EA',
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        alignSelf: 'flex-start', // Add this
    },
    referenceText: {
        fontSize: 14,
        color: '#964B00',
        fontFamily: theme.font.semiBold,
        textAlign: 'center',
        lineHeight: 16,
    },
    referenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 12,
        width: '100%',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#964B00',
        paddingVertical: 8,
        paddingHorizontal: 14,
        justifyContent: 'center',
        minWidth: 100,
    },
    editContainerDisabled: { // Add this style
        opacity: 0.5,
    },
    editText: {
        fontSize: 14,
        color: '#F9F9F9',
        fontFamily: theme.font.semiBold,
        marginLeft: 10, 
    },
});