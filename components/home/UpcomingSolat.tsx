import { theme } from '@/styles/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ArrowRight} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UpcomingSolat() {
    const router = useRouter();
    const handleSeeAll = () => {
        router.push('/(tabs)/(prayer-times)/prayerTimes');
    };

    const handlePrayerPress = () => {
        router.push('/(tabs)/(prayer-times)/prayerDetails');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.todayText}>Today</Text>
                    <Text style={styles.title}>Upcoming Solat</Text>
                </View>
                <TouchableOpacity onPress={handleSeeAll}>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.prayerCard}
                onPress={handlePrayerPress}
                activeOpacity={0.9}
            >
                <View style={styles.prayerContent}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../../assets/images/pTime.png')}
                            // style={styles.cardIcon}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.prayerInfo}>
                        <Text style={styles.prayerTime}>
                            Nov, 19 2025 • 12:30pm
                        </Text>
                        <Text style={styles.prayerName}>Dhuhr Prayer</Text>
                        <View style={styles.locationContainer}>
                            <MaterialIcons
                                name="location-on"
                                size={14}
                                color="rgba(255, 255, 255, 0.8)"
                            />
                            <Text style={styles.locationText}>Lagos, Nigeria</Text>
                        </View>
                    </View>
                </View>

                <ArrowRight
                    size={24}
                    color="rgba(255, 255, 255, 0.8)"
                    strokeWidth={2}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    todayText: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#999',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: theme.font.semiBold,
        color: theme.color.brand,
    },
    prayerCard: {
        backgroundColor: theme.color.brand,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    prayerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        // backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 28,
    },
    prayerInfo: {
        flex: 1,
        // gap: 2,
    },
    prayerTime: {
        fontSize: 13,
        fontFamily: theme.font.regular,
        color: theme.color.white,
    },
    prayerName: {
        fontSize: 20,
        fontFamily: theme.font.bold,
        color: theme.color.white,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    locationText: {
        fontSize: 13,
        fontFamily: theme.font.regular,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});