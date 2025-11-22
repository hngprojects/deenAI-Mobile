import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface ScreenHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    backRoute?: string;
    rightComponent?: React.ReactNode;
    titleAlign?: 'left' | 'center';
    titleStyle?: TextStyle;
    paddingTop?: number;
    headerStyle?: ViewStyle;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    showBackButton = true,
    onBackPress,
    backRoute,
    rightComponent,
    titleAlign = 'center',
    titleStyle,
    paddingTop = 0,
    headerStyle,
}) => {
    const router = useRouter();
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else if (backRoute) {
            router.push(backRoute);
        } else {
            // Try navigation.goBack() first (works in tab stacks)
            // Fall back to router.back() if goBack() doesn't work
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                router.back();
            }
        }
    };

    return (
        <View style={[styles.header, { paddingTop }, headerStyle]}>
            {showBackButton ? (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <ArrowLeft color={theme.color.secondary} size={24} />
                </TouchableOpacity>
            ) : (
                <View style={[styles.backButton, { width: 0 }]} />
            )}

            <Text
                style={[
                    styles.headerTitle,
                    titleAlign === 'left' && { textAlign: 'left' },
                    titleStyle,
                ]}
            >
                {title}
            </Text>

            {rightComponent ? (
                <View style={styles.rightComponent}>{rightComponent}</View>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.font.semiBold,
        color: theme.color.secondary,
        flex: 1,
        textAlign: 'center',
    },
    rightComponent: {
        width: 40,
        alignItems: 'flex-end',
    },
    placeholder: {
        width: 40,
    },
});

export default ScreenHeader;