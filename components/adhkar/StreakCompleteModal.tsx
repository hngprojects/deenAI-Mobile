import { useStreakStore } from "@/store/streak-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
    ScrollView,
} from "react-native";

interface StreakCompleteModalProps {
    visible: boolean;
    onClose: () => void;
    minutesSpent?: number;
}

const StreakCompleteModal: React.FC<StreakCompleteModalProps> = ({
    visible,
    onClose,
    minutesSpent = 0,
}) => {
    const { currentStreak, totalDays, getWeekStreak, getWeekdayLabel } = useStreakStore();
    const weekStreak = getWeekStreak();
    
    // Use responsive hook for screen dimensions
    const { width, height } = useWindowDimensions();
    
    // Responsive calculations
    const modalMaxWidth = Math.min(width * 0.9, 400);
    const modalMaxHeight = height * 0.85;
    const isSmallScreen = width < 375; // iPhone SE size

    const handleViewAnalytics = () => {
        onClose();
        router.push("/(adhkar)/streak-analytics");
    };

    const handleBackToAzkar = () => {
        onClose();
    };

    // Determine celebration message based on minutes spent
    const getCelebrationMessage = () => {
        if (minutesSpent >= 5) {
            return "Excellent focus! You spent meaningful time in remembrance.";
        } else if (minutesSpent >= 3) {
            return "Great dedication! Every moment of remembrance counts.";
        } else {
            return "Alhamdullilah! You've completed your Azkar for today. May your dedication be rewarded";
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[
                    styles.modal,
                    { 
                        maxWidth: modalMaxWidth,
                        maxHeight: modalMaxHeight,
                    }
                ]}>
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#999" />
                        </TouchableOpacity>

                        {/* Success Icon */}
                        <View style={[
                            styles.iconContainer,
                            isSmallScreen && styles.iconContainerSmall
                        ]}>
                            <Ionicons 
                                name="flame" 
                                size={isSmallScreen ? 48 : 56} 
                                color="#964B00" 
                            />
                        </View>

                        {/* Title */}
                        <Text style={[
                            styles.title,
                            isSmallScreen && styles.titleSmall
                        ]}>
                            {minutesSpent >= 5 ? "Amazing Focus! 🔥" : "Streak Complete!"}
                        </Text>
                        <Text style={[
                            styles.subtitle,
                            isSmallScreen && styles.subtitleSmall
                        ]}>
                            {getCelebrationMessage()}
                        </Text>

                        {/* Streak Counter */}
                        <View style={styles.streakContainer}>
                            <Ionicons 
                                name="flame" 
                                size={isSmallScreen ? 28 : 32} 
                                color="#964B00" 
                            />
                            <Text style={[
                                styles.streakNumber,
                                isSmallScreen && styles.streakNumberSmall
                            ]}>
                                {currentStreak}
                            </Text>
                        </View>
                        <Text style={[
                            styles.streakLabel,
                            isSmallScreen && styles.streakLabelSmall
                        ]}>
                            Days Streak!
                        </Text>

                        {/* Week Calendar */}
                        <View style={[
                            styles.weekContainer,
                            isSmallScreen && styles.weekContainerSmall
                        ]}>
                            {weekStreak.map((day, index) => (
                                <View key={`${day.date}-${index}`} style={styles.dayWrapper}>
                                    <View
                                        style={[
                                            styles.dayCircle,
                                            isSmallScreen && styles.dayCircleSmall,
                                            day.completed && styles.dayCircleCompleted,
                                        ]}
                                    >
                                        {day.completed && (
                                            <Ionicons 
                                                name="checkmark" 
                                                size={isSmallScreen ? 14 : 16} 
                                                color="#FFF" 
                                            />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.dayLabel,
                                        isSmallScreen && styles.dayLabelSmall
                                    ]}>
                                        {getWeekdayLabel(day.date)}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Today's Achievement */}
                        <View style={[
                            styles.achievementContainer,
                            isSmallScreen && styles.achievementContainerSmall
                        ]}>
                            <Text style={[
                                styles.achievementTitle,
                                isSmallScreen && styles.achievementTitleSmall
                            ]}>
                                Today&apos;s Achievement
                            </Text>

                            <View style={[
                                styles.statsRow,
                                isSmallScreen && styles.statsRowSmall
                            ]}>
                                <View style={styles.statItem}>
                                    <View style={[
                                        styles.statIconWrapper,
                                        isSmallScreen && styles.statIconWrapperSmall
                                    ]}>
                                        <Ionicons 
                                            name="time-outline" 
                                            size={isSmallScreen ? 20 : 24} 
                                            color="#964B00" 
                                        />
                                    </View>
                                    <Text style={[
                                        styles.statValue,
                                        isSmallScreen && styles.statValueSmall
                                    ]}>
                                        {minutesSpent}
                                    </Text>
                                    <Text style={[
                                        styles.statLabel,
                                        isSmallScreen && styles.statLabelSmall
                                    ]}>
                                        Minutes
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <View style={[
                                        styles.statIconWrapper,
                                        isSmallScreen && styles.statIconWrapperSmall
                                    ]}>
                                        <Ionicons 
                                            name="flame" 
                                            size={isSmallScreen ? 20 : 24} 
                                            color="#964B00" 
                                        />
                                    </View>
                                    <Text style={[
                                        styles.statValue,
                                        isSmallScreen && styles.statValueSmall
                                    ]}>
                                        {currentStreak}
                                    </Text>
                                    <Text style={[
                                        styles.statLabel,
                                        isSmallScreen && styles.statLabelSmall
                                    ]}>
                                        Day Streak
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <View style={[
                                        styles.statIconWrapper,
                                        isSmallScreen && styles.statIconWrapperSmall
                                    ]}>
                                        <Ionicons 
                                            name="calendar-outline" 
                                            size={isSmallScreen ? 20 : 24} 
                                            color="#964B00" 
                                        />
                                    </View>
                                    <Text style={[
                                        styles.statValue,
                                        isSmallScreen && styles.statValueSmall
                                    ]}>
                                        {totalDays}
                                    </Text>
                                    <Text style={[
                                        styles.statLabel,
                                        isSmallScreen && styles.statLabelSmall
                                    ]}>
                                        Total Days
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Time-based encouragement */}
                        {minutesSpent >= 2 && minutesSpent < 5 && (
                            <View style={styles.encouragementContainer}>
                                <Ionicons name="bulb-outline" size={20} color="#964B00" />
                                <Text style={styles.encouragementText}>
                                    Tip: Try spending 5+ minutes for deeper focus
                                </Text>
                            </View>
                        )}

                        {/* Buttons */}
                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                isSmallScreen && styles.primaryButtonSmall
                            ]}
                            onPress={handleViewAnalytics}
                        >
                            <Text style={[
                                styles.primaryButtonText,
                                isSmallScreen && styles.primaryButtonTextSmall
                            ]}>
                                View Analytics
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.secondaryButton,
                                isSmallScreen && styles.secondaryButtonSmall
                            ]}
                            onPress={handleBackToAzkar}
                        >
                            <Text style={[
                                styles.secondaryButtonText,
                                isSmallScreen && styles.secondaryButtonTextSmall
                            ]}>
                                Back to Azkar
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Base styles (for normal/large screens)
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    modal: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollView: {
        width: "100%",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32,
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 8,
        marginBottom: 8,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#FEF3E7",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1a1a1a",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 28,
        lineHeight: 20,
        paddingHorizontal: 8,
    },
    streakContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 8,
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: "700",
        color: "#964B00",
    },
    streakLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#964B00",
        textAlign: "center",
        marginBottom: 24,
    },
    weekContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    dayWrapper: {
        alignItems: "center",
        gap: 8,
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
    },
    dayCircleCompleted: {
        backgroundColor: "#964B00",
    },
    dayLabel: {
        fontSize: 12,
        color: "#666",
    },
    achievementContainer: {
        backgroundColor: "#FAFAFA",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        textAlign: "center",
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
        gap: 8,
    },
    statIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
    },
    primaryButton: {
        backgroundColor: "#964B00",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    primaryButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        backgroundColor: "transparent",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#1a1a1a",
        fontSize: 16,
        fontWeight: "600",
    },
    encouragementContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FEF3E7",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    encouragementText: {
        fontSize: 12,
        color: "#964B00",
        fontWeight: "500",
    },

    // Responsive styles for small screens (iPhone SE, etc.)
    iconContainerSmall: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 22,
        marginBottom: 10,
    },
    subtitleSmall: {
        fontSize: 13,
        marginBottom: 24,
        lineHeight: 18,
        paddingHorizontal: 4,
    },
    streakNumberSmall: {
        fontSize: 40,
    },
    streakLabelSmall: {
        fontSize: 16,
        marginBottom: 20,
    },
    weekContainerSmall: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    dayCircleSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    dayLabelSmall: {
        fontSize: 11,
    },
    achievementContainerSmall: {
        padding: 16,
        marginBottom: 20,
        borderRadius: 12,
    },
    achievementTitleSmall: {
        fontSize: 14,
        marginBottom: 16,
    },
    statsRowSmall: {
        gap: 8,
    },
    statIconWrapperSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    statValueSmall: {
        fontSize: 18,
    },
    statLabelSmall: {
        fontSize: 11,
    },
    primaryButtonSmall: {
        paddingVertical: 14,
        marginBottom: 10,
    },
    primaryButtonTextSmall: {
        fontSize: 14,
    },
    secondaryButtonSmall: {
        paddingVertical: 14,
    },
    secondaryButtonTextSmall: {
        fontSize: 14,
    },
});

export default StreakCompleteModal;