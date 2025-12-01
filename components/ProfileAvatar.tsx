import { theme } from '@/styles/theme';
import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ProfileAvatarProps {
    avatar?: string | null;
    name?: string;
    size?: number;
    style?: ViewStyle;
    showBorder?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    avatar,
    name = 'User',
    size = 56,
    style,
    showBorder = false,
}) => {
    // Extract initials from name (matching your existing logic)
    const getInitials = (fullName: string): string => {
        const names = fullName.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(name);
    const fontSize = size * 0.36; // Scale font size based on avatar size
    const borderRadius = size / 2;

    // If user has a profile image, show it
    if (avatar) {
        return (
            <View
                style={[
                    styles.container,
                    { width: size, height: size, borderRadius },
                    showBorder && styles.border,
                    style,
                ]}
            >
                <Image
                    source={{ uri: avatar }}
                    style={[styles.image, { width: size, height: size, borderRadius }]}
                    resizeMode="cover"
                />
            </View>
        );
    }

    // Otherwise, show initials (matching your existing design)
    return (
        <View
            style={[
                styles.container,
                styles.initialsContainer,
                { width: size, height: size, borderRadius },
                showBorder && styles.border,
                style,
            ]}
        >
            <Text style={[styles.initialsText, { fontSize }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    initialsContainer: {
        backgroundColor: theme.color.brand,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        fontFamily: theme.font.bold,
        color: theme.color.white,
    },
    border: {
        borderWidth: 2,
        borderColor: theme.color.white,
    },
});

export default ProfileAvatar;