import { theme } from '@/styles/theme';
import { Share2, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReflectionProps {
  title?: string;
}

export default function TodaysReflection({ title = "Today&lsquo;s Reflection" }: ReflectionProps) {
    const handleDelete = () => {
        // TODO: Delete reflection
        console.log('Delete pressed');
    };

    const handleShare = () => {
        // TODO: Share reflection
        console.log('Share pressed');
    };

    const handleAiAssistant = () => {
        // TODO: Open AI assistant
        console.log('AI assistant pressed');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>


            <View style={styles.card}>
                <View style={styles.quoteSection}>
                    <Text style={styles.quote}>
                        &ldquo;Indeed, with hardship comes ease.&ldquo;
                    </Text>
                    <Text style={styles.reference}>— Surah Ash-Sharh (94:6)</Text>
                </View>

                <View style={styles.reflectionSection}>
                    <Text style={styles.reflectionText}>
                        This verse reminds me that Allah&lsquo;s mercy always follows struggle.
                        Even in my quietest moments of doubt, I know ease is already
                        written, I just need patience to see it unfold...
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.savedDate}>Saved on Nov 2, 2025</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleDelete}
                        >
                            <Trash2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleShare}
                        >
                            <Share2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* <TouchableOpacity
                style={styles.aiButton}
                onPress={handleAiAssistant}
                activeOpacity={0.9}
            >
                <View style={styles.aiIconContainer}>
                    <Text style={styles.aiIcon}>🤖</Text>
                </View>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
    },
    card: {
        backgroundColor: theme.color.white,
        borderRadius: 20,
        // padding: 20,

        // gap: 16,
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
        color: theme.color.brand,
        lineHeight: 24,
        textAlign: 'center',
    },
    reference: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: theme.color.brand,
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
        color: '#999',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        // backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiButton: {
        position: 'absolute',
        right: 20,
        bottom: -20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#8B5A2B',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    aiIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiIcon: {
        fontSize: 28,
    },
});