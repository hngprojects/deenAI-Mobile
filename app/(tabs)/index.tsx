import ScreenContainer from '@/components/ScreenContainer';
import HomeHeader from '@/components/home/HomeHeader';
import QuickActions from '@/components/home/QuickActions';
import TodaysReflection from '@/components/home/TodaysReflection';
import UpcomingSolat from '@/components/home/UpcomingSolat';
import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ScreenContainer
            backgroundColor={theme.color.background}
            scrollable={true}
            showsVerticalScrollIndicator={false}
            paddingHorizontal={0}
            contentContainerStyle={styles.contentContainer}
        >
            <View style={styles.content}>
                <HomeHeader />
                <UpcomingSolat />
                <QuickActions />
                <TodaysReflection />
                
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 100,
    },
    content: {
        gap: 24,
    },
});