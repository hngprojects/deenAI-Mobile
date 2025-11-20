import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface ScreenContainerProps {
    children: ReactNode;
    backgroundColor?: string;
    statusBarStyle?: 'light' | 'dark' | 'auto';
    scrollable?: boolean;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: ViewStyle;
    paddingHorizontal?: number;
    keyboardAvoiding?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    backgroundColor = '#ffffff98',
    statusBarStyle = 'dark',
    scrollable = true,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
    paddingHorizontal = 20,
    keyboardAvoiding = true,
}) => {
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;

    const content = scrollable ? children : (
        <View style={styles.contentWrapper}>
            {children}
        </View>
    );

    const scrollContent = (
        <ScrollView
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            contentContainerStyle={[
                styles.scrollContent,
                {
                    paddingTop: statusBarHeight + 10,
                    paddingHorizontal: paddingHorizontal,
                },
                contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    );

    const keyboardAvoidingContent = keyboardAvoiding ? (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            {scrollable ? scrollContent : content}
        </KeyboardAvoidingView>
    ) : (
        scrollable ? scrollContent : content
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ExpoStatusBar
                style={statusBarStyle}
                backgroundColor={backgroundColor}
            />
            {keyboardAvoidingContent}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});

export default ScreenContainer;