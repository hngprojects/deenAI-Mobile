import { theme } from '@/styles/theme';
import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onPress: () => void;
    disabled?: boolean;
}

export default function Checkbox({
    label,
    checked,
    onPress,
    disabled = false,
}: CheckboxProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                checked && styles.checkboxChecked,
                disabled && styles.checkboxDisabled,
            ]}>
                {checked && (
                    <Check
                        size={14}
                        color={theme.color.white}
                        strokeWidth={3}
                    />
                )}
            </View>
            <Text style={[
                styles.label,
                disabled && styles.labelDisabled,
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D0D0D0',
        backgroundColor: theme.color.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: theme.color.brand,
        borderColor: theme.color.brand,
    },
    checkboxDisabled: {
        opacity: 0.5,
    },
    label: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
    },
    labelDisabled: {
        opacity: 0.5,
    },
});