import { theme } from '@/styles/theme';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';

interface GuestWarningModalProps {
    visible: boolean;
    onSignIn: () => void;
    onContinueReading: () => void;
    verseText?: string;
}

export default function GuestWarningModal({
    visible,
    onSignIn,
    onContinueReading,
    verseText,
}: GuestWarningModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onContinueReading}
        >
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onContinueReading}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            {/* Modal Card */}
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Verse Display */}
                    {/* {verseText && (
            <View style={styles.verseCard}>
              <Text style={styles.verseText}>{verseText}</Text>
            </View>
          )} */}

                    {/* Message */}
                    <Text style={styles.title}>Create an account to Save Your Reflection</Text>
                    <Text style={styles.subtitle}>
                        Sign Up to save and access your reflections
                    </Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title="Sign up"
                            onPress={onSignIn}
                            style={styles.signUpButton}
                        />
                        <SecondaryButton
                            title="Close"
                            onPress={onContinueReading}
                            style={styles.continueButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '95%',
        backgroundColor: theme.color.white,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    verseCard: {
        backgroundColor: '#FFF9F3',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        width: '100%',
    },
    verseText: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: theme.color.black,
        textAlign: 'center',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    title: {
        fontSize: 18,
        fontFamily: theme.font.extraBold,
        color: '#3C3A35',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    signUpButton: {
        marginBottom: 4,
    },
    continueButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
});