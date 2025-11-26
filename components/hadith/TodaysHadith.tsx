import { useHadithStore } from '@/store/hadith-store';
import { theme } from '@/styles/theme';
import { Hadith } from '@/types/hadith.types';
import { useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TodaysHadith() {
    const router = useRouter();
    const { loadCollection, getHadithByNumber, loadedData } = useHadithStore();
    const [todaysHadith, setTodaysHadith] = useState<Hadith | null>(null);
    const [collectionName, setCollectionName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDailyHadith();
    }, []);

    const getDayOfYear = (): number => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const loadDailyHadith = async () => {
        try {
            setIsLoading(true);

            // Define collections with approximate hadith counts
            const collections = [
                { id: 'bukhari', name: 'Sahih al-Bukhari', count: 7000 },
                { id: 'muslim', name: 'Sahih Muslim', count: 5000 },
                { id: 'abudawud', name: 'Sunan Abi Dawud', count: 4000 },
                { id: 'tirmidhi', name: "Jami' at-Tirmidhi", count: 3800 },
            ] as const;

            // Get day of year for consistency (same hadith for the whole day)
            const dayOfYear = getDayOfYear();

            // Select collection based on day
            const collectionIndex = dayOfYear % collections.length;
            const selectedCollection = collections[collectionIndex];

            // Load the collection
            await loadCollection(selectedCollection.id);

            // Use getState to get fresh data after loading
            const currentState = useHadithStore.getState();
            const data = currentState.loadedData[selectedCollection.id];

            if (!data) {
                setIsLoading(false);
                return;
            }

            const actualCount = data.english.hadiths.length;

            // Generate consistent random hadith number for today
            const hadithIndex = Math.floor((dayOfYear * 17) % actualCount);
            const hadith = data.english.hadiths[hadithIndex];

            if (hadith) {
                setTodaysHadith(hadith);
                setCollectionName(selectedCollection.name);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading daily hadith:', error);
            setIsLoading(false);
        }
    };

    const handleReflectOnHadith = () => {
        if (!todaysHadith) return;

        // Navigate to reflection with hadith data
        router.push({
            pathname: '/(tabs)/(reflect)/reflect-verse',
            params: {
                hadithNumber: todaysHadith.hadithnumber.toString(),
                hadithText: todaysHadith.text,
                collectionName: collectionName,
                bookNumber: todaysHadith.reference.book.toString(),
            },
        });
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Today&apos;s Hadith</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.color.brand} />
                </View>
            </View>
        );
    }

    if (!todaysHadith) {
        return null;
    }

    // Truncate hadith text for preview
    const truncateText = (text: string, maxLength: number = 200) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today&apos;s Reflection</Text>

            <View style={styles.card}>
                <View style={styles.hadithContent}>
                    <Text style={styles.hadithText}>
                        {truncateText(todaysHadith.text)}
                    </Text>

                    <View style={styles.referenceContainer}>
                        <Text style={styles.referenceText}>
                            ({collectionName})
                        </Text>
                    </View>
                </View>

            </View>
            <TouchableOpacity
                style={styles.reflectButton}
                onPress={handleReflectOnHadith}
                activeOpacity={0.8}
            >
                <Text style={styles.reflectButtonText}>Reflect on this hadith</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        // gap: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: theme.font.bold,
        color: '#000',
        marginBottom: 16,
    },
    loadingContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#ebebebff',
    },
    hadithContent: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hadithText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
        fontFamily: theme.font.semiBold,
    },
    referenceContainer: {
        alignSelf: 'flex-end',
    },
    referenceText: {
        fontSize: 16,
        color: '#666',
        fontFamily: theme.font.bold,
        textAlign: 'center',
    },
    reflectButton: {
        backgroundColor: theme.color.brand,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: theme.color.brand,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reflectButtonText: {
        fontSize: 16,
        fontFamily: theme.font.semiBold,
        color: '#FFF',
    },
});