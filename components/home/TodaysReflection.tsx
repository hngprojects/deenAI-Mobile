import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Edit2, Trash2 } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { reflectService } from '@/service/reflect.service';
import { quranService } from '@/service/quran.service';
import { Reflection } from '@/types/reflect.types';
import { useFocusEffect } from '@react-navigation/native';

interface ReflectionWithData extends Reflection {
    verseText?: string;
    surahName?: string;
    reference?: string;
}

interface ReflectionProps {
    title?: string;
    style?: object;
    showSeeAll?: boolean;
    onSeeAll?: () => void;
}

export default function TodaysReflection({
    title = 'My Saved Reflections',
    style,
    showSeeAll = false,
    onSeeAll
}: ReflectionProps) {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [reflection, setReflection] = useState<ReflectionWithData | null>(null);
    const [loading, setLoading] = useState(true);

    // Refresh when screen comes into focus (catches edits from other screens)
    useFocusEffect(
        useCallback(() => {
            console.log('🎯 TodaysReflection focused, refreshing...');
            loadLatestReflection();
        }, [])
    );

    const loadLatestReflection = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading latest reflection...');

            // Get user reflections (only 1)
            const userReflections = await reflectService.getUserReflections(1, 1, 'DESC');

            if (userReflections.length > 0) {
                const latestReflection = userReflections[0];

                // Enhance with verse data
                let verseText = '';
                let surahName = '';
                let reference = '';

                if (latestReflection.surah && latestReflection.startAyah) {
                    try {
                        // Get verse translation
                        const verse = await quranService.getVerse(
                            latestReflection.surah,
                            latestReflection.startAyah
                        );
                        if (verse) {
                            verseText = verse.translation;
                        }

                        // Get surah name
                        const surah = await quranService.getSurah(latestReflection.surah);
                        if (surah) {
                            surahName = surah.englishName;
                            reference = `Surah ${surah.englishName} (${surah.number}:${latestReflection.startAyah})`;
                        }
                    } catch (error) {
                        console.error('Error loading verse data:', error);
                    }
                }

                setReflection({
                    ...latestReflection,
                    verseText: verseText || "Reflection on Quranic verse",
                    surahName,
                    reference: reference || `Surah ${latestReflection.surah}:${latestReflection.startAyah || ''}`,
                });
            } else {
                setReflection(null);
            }
        } catch (error) {
            console.error('Error loading reflection:', error);
            setReflection(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!reflection) return;

        try {
            console.log('🗑️ Deleting reflection:', reflection.id);

            // Delete the reflection
            await reflectService.deleteReflection(reflection.id);
            setModalVisible(false);

            console.log('✅ Reflection deleted, checking for more reflections...');

            // After delete, check if user has any other reflections
            await loadLatestReflection();

        } catch (error) {
            console.error('❌ Error deleting reflection:', error);
            setModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setModalVisible(false);
    };

    const handleEdit = () => {
        if (!reflection) return;

        router.push({
            pathname: '/(tabs)/(reflect)/reflect-verse',
            params: {
                reflectionId: reflection.id,
                content: reflection.content,
                surahNumber: reflection.surah?.toString(),
                startAyah: reflection.startAyah?.toString() || '1',
                verseText: reflection.verseText || '',
                surahName: reflection.surahName || '',
                editMode: 'true'
            }
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, style]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.color.brand} />
                </View>
            </View>
        );
    }

    // No reflections - show empty state
    if (!reflection) {
        return (
            <View style={[styles.container, style]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No reflections yet</Text>
                    <Text style={styles.emptyStateSubtext}>
                        Start reflecting on verses to see them here
                    </Text>
                </View>
            </View>
        );
    }

    // Format date
    const formattedDate = new Date(reflection.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {showSeeAll && (
                    <TouchableOpacity onPress={onSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.card}>
                <View style={styles.quoteSection}>
                    <Text style={styles.quote}>
                        &ldquo;{reflection.verseText}&rdquo;
                    </Text>
                    <Text style={styles.reference}>— {reflection.reference}</Text>
                </View>

                <View style={styles.reflectionSection}>
                    <Text style={styles.reflectionText}>
                        {reflection.content}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.savedDate}>Saved on {formattedDate}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleDelete}
                        >
                            <Trash2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleEdit}
                        >
                            <Edit2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Delete Confirmation Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={cancelDelete}
                statusBarTranslucent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Delete</Text>
                        <Text style={styles.modalText}>
                            Are you sure you want to delete your reflection?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={cancelDelete}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>Keep My Reflection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={confirmDelete}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.deleteButtonText}>Yes! Delete Reflection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 20,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: theme.font.semiBold,
        color: theme.color.brand,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: theme.font.semiBold,
        color: theme.color.secondary,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#999',
        textAlign: 'center',
    },
    card: {
        backgroundColor: theme.color.white,
        borderRadius: 20,
    },
    quoteSection: {
        backgroundColor: '#F3EAD8',
        padding: 20,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        gap: 8,
    },
    quote: {
        fontSize: 16,
        fontFamily: theme.font.semiBold,
        color: '#4E3B18',
        lineHeight: 24,
        textAlign: 'center',
    },
    reference: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#4E3B18',
        textAlign: 'center',
    },
    reflectionSection: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 0,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderColor: '#E3E3E3',
    },
    reflectionText: {
        fontSize: 16,
        fontFamily: theme.font.semiBold,
        color: '#555',
        lineHeight: 24,
        paddingVertical: 10,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderColor: '#E3E3E3',
    },
    savedDate: {
        fontSize: 13,
        fontFamily: theme.font.regular,
        color: '#575757ff',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingTop: 28,
        paddingBottom: 28,
        paddingHorizontal: 28,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: theme.font.bold,
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: 12,
    },
    modalText: {
        fontSize: 15,
        fontFamily: theme.font.regular,
        color: '#1A1A1A',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
        gap: 14,
    },
    modalButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#1A1A1A',
    },
    cancelButtonText: {
        fontSize: 17,
        fontFamily: theme.font.semiBold,
        color: '#1A1A1A',
    },
    deleteButton: {
        backgroundColor: '#E55153',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: theme.font.semiBold,
    },
});