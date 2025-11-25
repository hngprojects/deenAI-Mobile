import { Stack } from 'expo-router';
import React from 'react';

export default function QuranLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
            }}
        >
            {/* Main Quran list screen - this is the index that shows in the tab */}
            <Stack.Screen
                name="index"
                options={{
                    animationEnabled: false,
                }}
            />

            {/* Surah detail - nested screen within the Quran tab */}
            <Stack.Screen
                name="surahDetail"
                options={{
                    animationEnabled: true,
                }}
            />
        </Stack>
    );
}