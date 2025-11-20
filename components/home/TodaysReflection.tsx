import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Edit2, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReflectionProps {
  title?: string;
  verse?: string;
  reference?: string;
  text?: string;
  date?: string;
  style?: object;
}

const defaultReflection = {
  verse: "Indeed, with hardship comes ease.",
  reference: "Surah Ash-Sharh (94:6)",
  text: "This verse reminds me that Allah's mercy always follows struggle...",
  date: "Nov 2, 2025",
};

export default function TodaysReflection({
    title,
    verse = defaultReflection.verse,
    reference = defaultReflection.reference,
    text = defaultReflection.text,
    date = defaultReflection.date,
    style
}: ReflectionProps) {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    
    const handleDelete = () => {
        setModalVisible(true);
    };

    // const handleShare = () => {
    //     // TODO: Share reflection
    //     console.log('Share pressed');
    // };

    // const handleAiAssistant = () => {
    //     // TODO: Open AI assistant
    //     console.log('AI assistant pressed');
    // };

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>


            <View style={styles.card}>
                <View style={styles.quoteSection}>
                    <Text style={styles.quote}>
                        &ldquo;{verse}&ldquo;
                    </Text>
                    <Text style={styles.reference}>— {reference}</Text>
                </View>

                <View style={styles.reflectionSection}>
                    <Text style={styles.reflectionText}>
                        {text}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.savedDate}>Saved on {date}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleDelete}
                        >
                            <Trash2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push('/edit-reflection')}
                        >
                            <Edit2 size={20} color="#999" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{fontWeight: 700, alignItems: "center"}}>Confirm Delete</Text>
                        <Text style={styles.modalText}>Are you sure you want to delete your reflection?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]}>
                                <Text>Keep My Reflection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#f55' }]}>
                                <Text style={{ color: '#fff' }}>Yes! Delete Reflection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            

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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20, gap: 16 },
    modalText: { fontSize: 16, fontFamily: theme.font.semiBold, textAlign: 'center' },
    modalButtons: { display: "flex", justifyContent: 'space-between', gap: 12 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', height: 50 },
});