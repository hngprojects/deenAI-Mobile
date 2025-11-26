import ScreenContainer from '@/components/ScreenContainer';
import DailyReflection from '@/components/home/DailyReflection';
import HomeHeader from '@/components/home/HomeHeader';
import QuickActions from '@/components/home/QuickActions';
import UpcomingSolat from '@/components/home/UpcomingSolat';
import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ScreenContainer
            backgroundColor={theme.color.background}
            fixedHeader={<HomeHeader />}
            scrollable={true}
            showsVerticalScrollIndicator={false}
            paddingHorizontal={0}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <View style={styles.content}>
                    <UpcomingSolat />
                    <QuickActions />

                    <View style={{ paddingHorizontal: 20 }}>
    <DailyReflection />
</View>

                    {/* <View style={{ paddingHorizontal: 20 }}>
                        <TodaysReflection />
                    </View> */}
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        // paddingBottom: 100,
    },
    content: {
        gap: 24,
        position: 'relative',
        paddingTop: 10,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: theme.color.background,
    }
});