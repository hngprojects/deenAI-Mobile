import ScreenContainer from '@/components/ScreenContainer';
import AdhkarCounter from '@/components/adhkar/AdhkarCounter';
import StreakCompleteModal from '@/components/adhkar/StreakCompleteModal';
import { useAdhkarStore } from '@/store/adhkar-store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function AdhkarDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const categoryId = params.categoryId as 'morning' | 'evening';
    const [isLoading, setIsLoading] = useState(true);

    // Use Zustand selectors for reactive state
    const currentIndex = useAdhkarStore((state) => state.currentIndex);
    const currentAdhkar = useAdhkarStore((state) => state.currentAdhkar);
    const completedCount = useAdhkarStore((state) => state.completedCount);
    const showStreakCompleteModal = useAdhkarStore((state) => state.showStreakCompleteModal);
    const setShowStreakCompleteModal = useAdhkarStore((state) => state.setShowStreakCompleteModal);
    const getSessionDuration = useAdhkarStore((state) => state.getSessionDuration);

    // Get actions separately (these don't change, so no re-render needed)
    const startAdhkarSession = useAdhkarStore((state) => state.startAdhkarSession);
    const incrementCount = useAdhkarStore((state) => state.incrementCount);
    const resetCount = useAdhkarStore((state) => state.resetCount);
    const nextAdhkar = useAdhkarStore((state) => state.nextAdhkar);
    const previousAdhkar = useAdhkarStore((state) => state.previousAdhkar);
    const resetSession = useAdhkarStore((state) => state.resetSession);

    useEffect(() => {
        if (categoryId === 'morning' || categoryId === 'evening') {
            startAdhkarSession(categoryId);
            setIsLoading(false);
        } else {
            console.error('Invalid category:', categoryId);
            router.back();
        }

        return () => {
            resetSession();
        };
    }, [categoryId, startAdhkarSession, resetSession, router]);

    const currentAdhkarItem = currentAdhkar[currentIndex];
    const currentCount = completedCount[currentIndex] || 0;

    const handleCloseModal = () => {
        setShowStreakCompleteModal(false);
    };

    if (isLoading) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#964B00" />
                </View>
            </ScreenContainer>
        );
    }

    if (!currentAdhkarItem) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Adhkar...</Text>
                </View>
            </ScreenContainer>
        );
    }

    const handleIncrement = () => {
        if (!currentAdhkarItem) return;

        if (currentCount < currentAdhkarItem.count) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            incrementCount();
        }
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (currentIndex === currentAdhkar.length - 1) {
            Alert.alert(
                'Completed! 🎉',
                `Alhamdulillah! You have completed all ${categoryId} adhkar.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            nextAdhkar();
        }
    };

    const handlePrevious = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        previousAdhkar();
    };

    const handleReset = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        resetCount();
    };

    const isCompleted = currentCount >= currentAdhkarItem.count;

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {categoryId === 'morning' ? 'Morning Azkar' : 'Evening Azkar'}
                </Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Image
                    source={
                        categoryId === 'morning'
                            ? require('@/assets/images/adhkar/morning.png')
                            : require('@/assets/images/adhkar/evening.png')
                    }
                    style={styles.heroImage}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.adhkarTitle} numberOfLines={2}>
                        {currentAdhkarItem.source.split('.')[0] || 'Adhkar'}
                    </Text>
                    <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>
                            {currentIndex + 1}/{currentAdhkar.length}
                        </Text>
                    </View>
                </View>

                <View style={styles.contentCard}>
                    <Text style={styles.arabicText}>{currentAdhkarItem.content}</Text>

                    <Text style={styles.transliterationText}>
                        {currentAdhkarItem.transliteration}
                    </Text>

                    <Text style={styles.translationText}>
                        {currentAdhkarItem.translation}
                    </Text>

                    <View style={styles.referenceContainer}>
                        <View style={styles.referenceLeft}>
                            <Ionicons name="book-outline" size={20} color="#964B00" />
                            <Text style={styles.referenceText} numberOfLines={1}>
                                {currentAdhkarItem.source.split('(')[0].trim() || 'Reference'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="share-social" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <AdhkarCounter
                    current={currentCount}
                    total={currentAdhkarItem.count}
                    onIncrement={handleIncrement}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    disablePrevious={currentIndex === 0}
                    disableNext={currentIndex === currentAdhkar.length - 1}
                />

                {/* {currentCount > 0 && (
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={handleReset}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="refresh" size={16} color="#964B00" />
                        <Text style={styles.resetText}>Reset Count</Text>
                    </TouchableOpacity>
                )} */}
            </View>

            {/* Streak Complete Modal */}
            <StreakCompleteModal
                visible={showStreakCompleteModal}
                onClose={handleCloseModal}
                minutesSpent={getSessionDuration()}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    menuButton: {
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 200,
    },
    heroImage: {
        width: width,
        height: 220,
        resizeMode: 'cover',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    adhkarTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 24,
    },
    progressBadge: {
        backgroundColor: '#964B00',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    progressText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    contentCard: {
        backgroundColor: '#F9F9F9',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
    },
    arabicText: {
        fontSize: 26,
        lineHeight: 48,
        textAlign: 'right',
        color: '#1a1a1a',
        fontFamily: 'Scheherazade-Regular',
        marginBottom: 20,
    },
    transliterationText: {
        fontSize: 15,
        lineHeight: 26,
        color: '#555',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    translationText: {
        fontSize: 15,
        lineHeight: 26,
        color: '#333',
        marginBottom: 16,
    },
    referenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginTop: 4,
    },
    referenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    referenceText: {
        flex: 1,
        fontSize: 13,
        color: '#964B00',
        fontWeight: '600',
    },
    shareButton: {
        backgroundColor: '#964B00',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitsCard: {
        backgroundColor: '#FEF3E2',
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#964B00',
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#964B00',
        marginBottom: 8,
    },
    benefitsText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#555',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        marginTop: 12,
    },
    resetText: {
        color: '#964B00',
        fontSize: 14,
        fontWeight: '600',
    },
});