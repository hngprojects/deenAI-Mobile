import { useStreakStore } from "@/store/streak-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface StreakCompleteModalProps {
    visible: boolean;
    onClose: () => void;
    minutesSpent?: number;
}

const StreakCompleteModal: React.FC<StreakCompleteModalProps> = ({
    visible,
    onClose,
    minutesSpent = 5,
}) => {
    const { currentStreak, totalDays, getWeekStreak } = useStreakStore();
    const weekStreak = getWeekStreak();

    const handleViewAnalytics = () => {
        onClose();
        router.push("/(adhkar)/streak-analytics");
    };

    const handleBackToAzkar = () => {
        onClose();
    };

    const getDayLabel = (index: number) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[index];
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#999" />
                    </TouchableOpacity>

                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="flame" size={56} color="#964B00" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Streak Complete!</Text>
                    <Text style={styles.subtitle}>
                        Alhamdullilah! You&apos;ve completed your Azkar for today. May your
                        dedication be rewarded
                    </Text>

                    {/* Streak Counter */}
                    <View style={styles.streakContainer}>
                        <Ionicons name="flame" size={32} color="#964B00" />
                        <Text style={styles.streakNumber}>{currentStreak}</Text>
                    </View>
                    <Text style={styles.streakLabel}>Days Streak!</Text>

                    {/* Week Calendar */}
                    <View style={styles.weekContainer}>
                        {weekStreak.map((day, index) => (
                            <View key={day.date} style={styles.dayWrapper}>
                                <View
                                    style={[
                                        styles.dayCircle,
                                        day.completed && styles.dayCircleCompleted,
                                    ]}
                                >
                                    {day.completed && (
                                        <Ionicons name="checkmark" size={16} color="#FFF" />
                                    )}
                                </View>
                                <Text style={styles.dayLabel}>{getDayLabel(index)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Today's Achievement */}
                    <View style={styles.achievementContainer}>
                        <Text style={styles.achievementTitle}>Today&apos;s Achievement</Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={styles.statIconWrapper}>
                                    <Ionicons name="time-outline" size={24} color="#964B00" />
                                </View>
                                <Text style={styles.statValue}>{minutesSpent}</Text>
                                <Text style={styles.statLabel}>Minutes</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={styles.statIconWrapper}>
                                    <Ionicons name="flame" size={24} color="#964B00" />
                                </View>
                                <Text style={styles.statValue}>{currentStreak}</Text>
                                <Text style={styles.statLabel}>Day Streak</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={styles.statIconWrapper}>
                                    <Ionicons name="calendar-outline" size={24} color="#964B00" />
                                </View>
                                <Text style={styles.statValue}>{totalDays}</Text>
                                <Text style={styles.statLabel}>Total Days</Text>
                            </View>
                        </View>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleViewAnalytics}
                    >
                        <Text style={styles.primaryButtonText}>View Analytics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleBackToAzkar}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Azkar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modal: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32,
        width: "100%",
        maxWidth: 400,
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
});

export default StreakCompleteModal;