import { CombinedHadith } from "@/types/hadith.types";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

interface HadithItemProps {
    hadith: CombinedHadith;
    onBookmark?: () => void;
    isBookmarked?: boolean;
}

const HadithItem: React.FC<HadithItemProps> = ({
    hadith,
    onBookmark,
    isBookmarked = false,
}) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Hadith ${hadith.hadithNumber}\n\n${hadith.arabicText}\n\nTranslation:\n${hadith.englishText}`,
            });
        } catch (error) {
            console.error("Error sharing hadith:", error);
        }
    };

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(
                `Hadith ${hadith.hadithNumber}\n\n${hadith.arabicText}\n\nTranslation:\n${hadith.englishText}`
            );
            // You can show a toast notification here
            alert("Hadith copied to clipboard");
        } catch (error) {
            console.error("Error copying hadith:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Hadith Number Badge */}
            <View style={styles.numberBadge}>
                <Text style={styles.numberText}>Hadith {hadith.hadithNumber}</Text>
                {hadith.arabicNumber && (
                    <Text style={styles.arabicNumber}>{hadith.arabicNumber}</Text>
                )}
            </View>

            {/* Arabic Text */}
            <View style={styles.arabicContainer}>
                <Text style={styles.arabicText}>{hadith.arabicText}</Text>
            </View>

            {/* English Translation */}
            <View style={styles.englishContainer}>
                <Text style={styles.sectionLabel}>Translation:</Text>
                <Text style={styles.englishText}>{hadith.englishText}</Text>
            </View>

            {/* Grades */}
            {hadith.grades && hadith.grades.length > 0 && (
                <View style={styles.gradesContainer}>
                    <Text style={styles.sectionLabel}>Grading:</Text>
                    {hadith.grades.map((grade, idx) => (
                        <Text key={idx} style={styles.gradeText}>
                            • {grade.graded_by}: {grade.grade}
                        </Text>
                    ))}
                </View>
            )}

            {/* Action Icons */}
            <View style={styles.actionIcons}>
                <Pressable style={styles.iconButton} onPress={onBookmark}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color={isBookmarked ? "#4A90E2" : "#666"}
                    />
                </Pressable>
                <Pressable style={styles.iconButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={22} color="#666" />
                </Pressable>
                <Pressable style={styles.iconButton} onPress={handleCopy}>
                    <Ionicons name="copy-outline" size={22} color="#666" />
                </Pressable>
            </View>
        </View>
    );
};

export default HadithItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    numberBadge: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    numberText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    arabicNumber: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4A90E2",
    },
    arabicContainer: {
        marginBottom: 20,
        padding: 12,
        backgroundColor: "#FAFAFA",
        borderRadius: 8,
        borderRightWidth: 3,
        borderRightColor: "#4A90E2",
    },
    arabicText: {
        textAlign: "right",
        fontSize: 20,
        lineHeight: 36,
        color: "#1f1f1f",
        fontFamily: "Scheherazade-Regular",
    },
    englishContainer: {
        marginBottom: 16,
    },
    sectionLabel: {
        fontWeight: "600",
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    englishText: {
        fontSize: 16,
        lineHeight: 26,
        color: "#333",
    },
    gradesContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#F0F8FF",
        borderRadius: 8,
    },
    gradeText: {
        fontSize: 13,
        color: "#555",
        marginBottom: 4,
    },
    actionIcons: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    iconButton: {
        padding: 8,
    },
});