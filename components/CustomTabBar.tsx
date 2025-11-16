import { theme } from '@/styles/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const icon = options.tabBarIcon
                        ? options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? theme.color.white : '#999',
                            size: 24,
                        })
                        : null;

                    const label = options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[
                                styles.tab,
                                isFocused && styles.activeTab,
                            ]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.tabContent}>
                                {icon}
                                {isFocused && (
                                    <Text style={styles.tabLabel}>
                                        {typeof label === 'string' ? label : ''}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 50,
        height: 70,
        paddingHorizontal: 10,

    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 8,
    },
    activeTab: {
        backgroundColor: theme.color.brand,
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tabLabel: {
        fontSize: 14,
        fontFamily: theme.font.semiBold,
        color: theme.color.white,
    },
});