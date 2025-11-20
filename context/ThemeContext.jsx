import { darkTheme, lightTheme } from '@/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system');
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        if (isReady) {
            updateTheme();
        }
    }, [themeMode, systemColorScheme, isReady]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('themeMode');
            if (savedTheme) {
                setThemeMode(savedTheme);
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        } finally {
            setIsReady(true);
        }
    };

    const updateTheme = () => {
        let activeTheme;

        if (themeMode === 'system') {
            activeTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        } else {
            activeTheme = themeMode === 'dark' ? darkTheme : lightTheme;
        }

        setCurrentTheme(activeTheme);
    };

    const changeTheme = async (mode) => {
        try {
            await AsyncStorage.setItem('themeMode', mode);
            setThemeMode(mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = currentTheme === lightTheme ? 'dark' : 'light';
        changeTheme(newMode);
    };

    const isDark = currentTheme === darkTheme;

    const value = {
        theme: currentTheme,
        themeMode,
        isDark,
        changeTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider. Make sure your component is wrapped with <ThemeProvider>.');
    }

    return context;
};