import { useHadithStore } from '@/store/hadith-store';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HadithBooksScreen() {
    const router = useRouter();
    const {
        currentCollection,
        getBooksByCollection,
        setCurrentBook,
        collections
    } = useHadithStore();

    const books = currentCollection ? getBooksByCollection(currentCollection) : [];
    const collection = collections.find(c => c.id === currentCollection);

    if (!books.length && currentCollection) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading books...</Text>
                </View>
            </View>
        );
    }

    const handleBookPress = (book: any) => {
        setCurrentBook(book);
        router.push(`/(hadith)/hadith-details`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{collection?.name || 'Books'}</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Books List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Lists</Text>

                {books.map((book, index) => (
                    <TouchableOpacity
                        key={book.bookNumber}
                        style={styles.bookItem}
                        onPress={() => handleBookPress(book)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.bookLeft}>
                            <View style={styles.bookNumberBadge}>
                                <Text style={styles.bookNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.bookName}>{book.book}</Text>
                        </View>

                        <Text style={styles.hadithRange}>
                            {book.hadithStartNumber}-{book.hadithEndNumber}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        // borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        // fontWeight: '600',
        color: '#000',
        fontFamily: theme.font.bold,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 23,
    },
    sectionTitle: {
        fontSize: 20,
        // fontWeight: '700',
        color: '#000',
        marginBottom: 24,
        fontFamily: theme.font.bold,

    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        // paddingHorizontal: 16,
        // backgroundColor: '#F8F8F8',
        borderRadius: 12,
        marginBottom: 12,
    },
    bookLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bookNumberBadge: {
        width: 30,
        height: 30,
        borderRadius: 7,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#edededff',
    },
    bookNumber: {
        fontSize: 14,
        fontFamily: theme.font.semiBold,
        color: '#000',
    },
    bookName: {
        fontSize: 17,
        fontFamily: theme.font.bold,
        color: '#000',
        flex: 1,
    },
    hadithRange: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        // fontWeight: '500',
        color: '#8C8C8C',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});