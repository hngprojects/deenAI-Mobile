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

interface StreakBottomDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const StreakBottomDrawer: React.FC<StreakBottomDrawerProps> = ({
    visible,
    onClose,
}) => {
    const {
        currentStreak,
        isStreakAtRisk,
        getTimeUntilMidnight,
        lastCompletedDate,
        getWeekStreak,
    } = useStreakStore();

    const weekStreak = getWeekStreak();
    const hoursLeft = getTimeUntilMidnight();
    const atRisk = isStreakAtRisk();
    const isFirstTime = currentStreak === 0;
    const isStreakLost =
        lastCompletedDate &&
        new Date(lastCompletedDate).toDateString() !==
        new Date(new Date().setDate(new Date().getDate() - 1)).toDateString() &&
        currentStreak === 0;

    const handleContinue = () => {
        useStreakStore.getState().markDrawerAsSeen();
        router.push("/(adhkar)/streak-analytics");
        onClose();

    };

    const handleReciteNow = () => {
        useStreakStore.getState().markDrawerAsSeen();
        onClose();
        router.push("/(adhkar)");
    };

    const handleRemindLater = () => {
        // Could implement a reminder notification here
        handleContinue();
    };

    const getDayLabel = (index: number) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[index];
    };

    // Icon Component
    const StreakIcon = ({ type }: { type: "welcome" | "risk" | "lost" }) => {
        if (type === "welcome" || type === "risk") {
            return (
                <View style={styles.iconContainer}>
                    <Ionicons name="flash" size={48} color="#964B00" />
                </View>
            );
        }

        return (
            <View style={styles.iconContainer}>
                <View style={styles.lostIconWrapper}>
                    <Ionicons name="flame" size={40} color="#964B00" />
                    <View style={styles.lostBadge}>
                        <Ionicons name="close" size={20} color="#FFF" />
                    </View>
                </View>
            </View>
        );
    };

    // Render different content based on streak status
    const renderContent = () => {
        // First time user (no streak yet)
        if (isFirstTime) {
            return (
                <>
                    <StreakIcon type="welcome" />

                    <Text style={styles.title}>Welcome to Deen AI!</Text>
                    <Text style={styles.subtitle}>
                        This is your first step toward building a consistent spiritual
                        rhythm.
                    </Text>

                    <View style={styles.streakContainer}>
                        <Ionicons name="flame" size={32} color="#964B00" />
                        <Text style={styles.streakNumber}>0</Text>
                    </View>
                    <Text style={styles.streakLabel}>Days Streak!</Text>

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

                    <Text style={styles.motivationText}>
                        Start your daily recitation now and your streak will begin today.
                    </Text>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </TouchableOpacity>
                </>
            );
        }

        // Streak Lost
        if (isStreakLost) {
            return (
                <>
                    <StreakIcon type="lost" />

                    <Text style={styles.title}>Streak Lost</Text>
                    <Text style={styles.subtitle}>
                        You missed yesterday&apos;s Azkar. Your 12-day streak has ended, but
                        don&apos;t worry, you can start fresh today!
                    </Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Ionicons name="flame-outline" size={24} color="#964B00" />
                            <Text style={styles.statLabel}>Previous Streak</Text>
                            <Text style={styles.statValue}>
                                {useStreakStore.getState().longestStreak} Days
                            </Text>
                        </View>

                        <View style={styles.statBox}>
                            <Ionicons name="trophy-outline" size={24} color="#964B00" />
                            <Text style={styles.statLabel}>Your Best Streak</Text>
                            <Text style={styles.statValue}>
                                {useStreakStore.getState().longestStreak} Days
                            </Text>
                        </View>
                    </View>

                    <View style={styles.motivationBox}>
                        <Ionicons name="refresh" size={24} color="#964B00" />
                        <View style={styles.motivationContent}>
                            <Text style={styles.motivationTitle}>Keep Going</Text>
                            <Text style={styles.motivationSubtext}>
                                Every journey has its ups and downs, what matters is that you
                                continue. start your new streak today!
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleReciteNow}
                    >
                        <Text style={styles.primaryButtonText}>Begin Today&apos;s Azkar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                        <Text style={styles.secondaryButtonText}>See My Progress</Text>
                    </TouchableOpacity>
                </>
            );
        }

        // Streak at Risk
        if (atRisk) {
            return (
                <>
                    <StreakIcon type="risk" />

                    <Text style={styles.title}>Streak at Risk!</Text>
                    <Text style={styles.subtitle}>Don&apos;t lose your progress</Text>

                    <View style={styles.streakContainer}>
                        <Ionicons name="flame" size={32} color="#964B00" />
                        <Text style={styles.streakNumber}>{currentStreak}</Text>
                    </View>
                    <Text style={styles.streakLabel}>Days Streak!</Text>

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

                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            You have <Text style={styles.warningBold}>{hoursLeft} hours</Text>{" "}
                            remaining to complete today&apos;s reading. Don&apos;t let your{" "}
                            {currentStreak}-day streak go to waste!
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleReciteNow}
                    >
                        <Text style={styles.primaryButtonText}>Recite Azkar Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleRemindLater}
                    >
                        <Text style={styles.secondaryButtonText}>Remind me later</Text>
                    </TouchableOpacity>
                </>
            );
        }

        // Welcome Back (has active streak, hasn't completed today yet)
        return (
            <>
                <StreakIcon type="welcome" />

                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Your previous streak was</Text>

                <View style={styles.streakContainer}>
                    <Ionicons name="flame" size={32} color="#964B00" />
                    <Text style={styles.streakNumber}>{currentStreak}</Text>
                </View>
                <Text style={styles.streakLabel}>Days Streak!</Text>

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

                <Text style={styles.motivationText}>
                    Keep up your amazing progress! Complete today&apos;s reading to continue
                    your streak.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                    <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdropTouchable}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.drawer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#999" />
                    </TouchableOpacity>

                    {renderContent()}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    backdropTouchable: {
        flex: 1,
    },
    drawer: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: "85%",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFF",
        borderWidth: 2,
        borderColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 20,
    },
    lostIconWrapper: {
        position: "relative",
    },
    lostBadge: {
        position: "absolute",
        bottom: -5,
        right: -5,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a1a1a",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
        paddingHorizontal: 20,
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
        marginBottom: 24,
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
    motivationText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    warningBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FEE2E2",
        padding: 16,
        marginBottom: 24,
    },
    warningText: {
        fontSize: 14,
        color: "#DC2626",
        textAlign: "center",
        lineHeight: 20,
    },
    warningBold: {
        fontWeight: "700",
    },
    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        gap: 8,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    motivationBox: {
        flexDirection: "row",
        backgroundColor: "#FEF3E7",
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 24,
    },
    motivationContent: {
        flex: 1,
    },
    motivationTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    motivationSubtext: {
        fontSize: 12,
        color: "#666",
        lineHeight: 18,
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
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    secondaryButtonText: {
        color: "#1a1a1a",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default StreakBottomDrawer;