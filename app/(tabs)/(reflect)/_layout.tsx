import { Stack } from 'expo-router';
import React from 'react';

export default function ReflectLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
            }}
        >
            {/* Main Reflect screen - this shows in the tab */}
            <Stack.Screen
                name="index"
                options={{
                    animationEnabled: false,
                }}
            />

            {/* Nested screens within Reflect tab */}
            <Stack.Screen
                name="reflect-verse"
                options={{
                    animationEnabled: true,
                }}
            />

            <Stack.Screen
                name="reflect-success"
                options={{
                    animationEnabled: true,
                }}
            />

            <Stack.Screen
                name="edit-reflection"
                options={{
                    animationEnabled: true,
                }}
            />

            <Stack.Screen
                name="saved-reflection"
                options={{
                    animationEnabled: true,
                }}
            />
        </Stack>
    );
}