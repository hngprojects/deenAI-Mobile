import { useHadithStore } from '@/store/hadith-store';
import { theme } from '@/styles/theme';
import { HadithCollectionId } from '@/types/hadith.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HadithCollectionsScreen() {
    const router = useRouter();
    const { collections, loadCollection, setCurrentCollection, isLoading } = useHadithStore();
    const [loadingCollection, setLoadingCollection] = React.useState<string | null>(null);

    const handleCollectionPress = async (collectionId: HadithCollectionId) => {
        setLoadingCollection(collectionId);
        await loadCollection(collectionId);
        setCurrentCollection(collectionId);
        setLoadingCollection(null);
        router.push(`/(hadith)/hadith-books`);
    };

    return (
        <View style={styles.container}>
            {/* <StatusBar barStyle="dark-content" /> */}

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hadiths Collections</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Collections List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {collections.map((collection) => (
                    <TouchableOpacity
                        key={collection.id}
                        style={styles.collectionCard}
                        onPress={() => handleCollectionPress(collection.id as HadithCollectionId)}
                        activeOpacity={0.7}
                        disabled={loadingCollection === collection.id}
                    >
                        {/* Book Cover */}
                        <View style={styles.bookCoverContainer}>
                            <Image
                                source={collection.image}
                                style={styles.bookCover}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Collection Info */}
                        <View style={styles.collectionInfo}>
                            <Text style={styles.collectionName}>{collection.name}</Text>
                            <Text style={styles.collectionDescription} numberOfLines={5}>
                                {collection.description}
                            </Text>

                            {loadingCollection === collection.id && (
                                <ActivityIndicator
                                    size="small"
                                    color="#007AFF"
                                    style={styles.loader}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        // backgroundColor: '#FFF',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        // fontWeight: '600',
        fontFamily: theme.font.bold,
        color: '#000',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    collectionCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    bookCoverContainer: {
        marginRight: 16,
    },
    bookCover: {
        width: 110,
        height: 150,
        borderRadius: 10,
    },
    collectionInfo: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    collectionName: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
        fontFamily: theme.font.semiBold,
    },
    collectionDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        fontFamily: theme.font.regular,

    },
    loader: {
        marginTop: 8,
    },
});