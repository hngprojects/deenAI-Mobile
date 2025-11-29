import { HadithCollectionId } from '@/types/hadith.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@hadith_bookmarks';
const FAVORITES_KEY = '@hadith_favorites';
const READING_HISTORY_KEY = '@hadith_reading_history';

export interface BookmarkedHadith {
    collectionId: HadithCollectionId;
    hadithNumber: number;
    bookNumber: number;
    bookName: string;
    timestamp: number;
}

export interface ReadingHistoryItem {
    collectionId: HadithCollectionId;
    hadithNumber: number;
    bookNumber: number;
    bookName: string;
    timestamp: number;
}

// Bookmarks
export const getBookmarks = async (): Promise<BookmarkedHadith[]> => {
    try {
        const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting bookmarks:', error);
        return [];
    }
};

export const addBookmark = async (bookmark: BookmarkedHadith): Promise<void> => {
    try {
        const bookmarks = await getBookmarks();
        const exists = bookmarks.some(
            b => b.collectionId === bookmark.collectionId &&
                b.hadithNumber === bookmark.hadithNumber
        );

        if (!exists) {
            bookmarks.push(bookmark);
            await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        }
    } catch (error) {
        console.error('Error adding bookmark:', error);
    }
};

export const removeBookmark = async (
    collectionId: HadithCollectionId,
    hadithNumber: number
): Promise<void> => {
    try {
        const bookmarks = await getBookmarks();
        const filtered = bookmarks.filter(
            b => !(b.collectionId === collectionId && b.hadithNumber === hadithNumber)
        );
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing bookmark:', error);
    }
};

export const isBookmarked = async (
    collectionId: HadithCollectionId,
    hadithNumber: number
): Promise<boolean> => {
    try {
        const bookmarks = await getBookmarks();
        return bookmarks.some(
            b => b.collectionId === collectionId && b.hadithNumber === hadithNumber
        );
    } catch (error) {
        console.error('Error checking bookmark:', error);
        return false;
    }
};

// Favorites (similar to bookmarks but different use case)
export const getFavorites = async (): Promise<BookmarkedHadith[]> => {
    try {
        const data = await AsyncStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

export const addFavorite = async (favorite: BookmarkedHadith): Promise<void> => {
    try {
        const favorites = await getFavorites();
        const exists = favorites.some(
            f => f.collectionId === favorite.collectionId &&
                f.hadithNumber === favorite.hadithNumber
        );

        if (!exists) {
            favorites.push(favorite);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
};

export const removeFavorite = async (
    collectionId: HadithCollectionId,
    hadithNumber: number
): Promise<void> => {
    try {
        const favorites = await getFavorites();
        const filtered = favorites.filter(
            f => !(f.collectionId === collectionId && f.hadithNumber === hadithNumber)
        );
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};

export const isFavorited = async (
    collectionId: HadithCollectionId,
    hadithNumber: number
): Promise<boolean> => {
    try {
        const favorites = await getFavorites();
        return favorites.some(
            f => f.collectionId === collectionId && f.hadithNumber === hadithNumber
        );
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
};

// Reading History
export const getReadingHistory = async (): Promise<ReadingHistoryItem[]> => {
    try {
        const data = await AsyncStorage.getItem(READING_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting reading history:', error);
        return [];
    }
};

export const addToReadingHistory = async (item: ReadingHistoryItem): Promise<void> => {
    try {
        const history = await getReadingHistory();

        // Remove existing entry if it exists
        const filtered = history.filter(
            h => !(h.collectionId === item.collectionId && h.hadithNumber === item.hadithNumber)
        );

        // Add to beginning
        filtered.unshift(item);

        // Keep only last 100 items
        const trimmed = filtered.slice(0, 100);

        await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Error adding to reading history:', error);
    }
};

export const clearReadingHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(READING_HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing reading history:', error);
    }
};

// Search
export const searchHadiths = (
    hadiths: any[],
    query: string,
    language: 'arabic' | 'english'
): any[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return hadiths.filter(hadith => {
        const text = hadith.text.toLowerCase();
        return text.includes(lowerQuery);
    });
};