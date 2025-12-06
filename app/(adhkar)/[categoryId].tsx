// import ScreenContainer from "@/components/ScreenContainer";
// import AdhkarCounter from "@/components/adhkar/AdhkarCounter";
// import StreakCompleteModal from "@/components/adhkar/StreakCompleteModal";
// import { useAdhkarStore } from "@/store/adhkar-store";
// import { Ionicons } from "@expo/vector-icons";
// import * as Haptics from "expo-haptics";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { theme } from "@/styles/theme";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Share,
// } from "react-native";

// const { width } = Dimensions.get("window");

// export default function AdhkarDetailScreen() {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const categoryId = params.categoryId as "morning" | "evening";
//   const [isLoading, setIsLoading] = useState(true);

//   // Use Zustand selectors for reactive state
//   const currentIndex = useAdhkarStore((state) => state.currentIndex);
//   const currentAdhkar = useAdhkarStore((state) => state.currentAdhkar);
//   const completedCount = useAdhkarStore((state) => state.completedCount);
//   const showStreakCompleteModal = useAdhkarStore(
//     (state) => state.showStreakCompleteModal
//   );
//   const setShowStreakCompleteModal = useAdhkarStore(
//     (state) => state.setShowStreakCompleteModal
//   );
//   const getSessionDuration = useAdhkarStore((state) => state.getSessionDuration);
//   const getTotalProgress = useAdhkarStore((state) => state.getTotalProgress);
//   const isCompleted = useAdhkarStore((state) => state.isCompleted);

//   const startAdhkarSession = useAdhkarStore(
//     (state) => state.startAdhkarSession
//   );
//   const incrementCount = useAdhkarStore((state) => state.incrementCount);
//   const resetCount = useAdhkarStore((state) => state.resetCount);
//   const nextAdhkar = useAdhkarStore((state) => state.nextAdhkar);
//   const previousAdhkar = useAdhkarStore((state) => state.previousAdhkar);
//   const resetSession = useAdhkarStore((state) => state.resetSession);

//   useEffect(() => {
//     if (categoryId === "morning" || categoryId === "evening") {
//       // ✅ FIXED: No cleanup function expected anymore
//       startAdhkarSession(categoryId);
//       setIsLoading(false);
//     } else {
//       console.error("Invalid category:", categoryId);
//       router.back();
//     }

//     return () => {
//       // ✅ Cleanup on unmount
//       resetSession();
//     };
//   }, [categoryId, startAdhkarSession, resetSession, router]);

//   const currentAdhkarItem = currentAdhkar[currentIndex];
//   const currentCount = completedCount[currentIndex] || 0;

//   const handleCloseModal = () => {
//     setShowStreakCompleteModal(false);
//   };

//   // Share functionality
//   const handleShare = async () => {
//     if (!currentAdhkarItem) return;

//     try {
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

//       const shareMessage = `
// ${currentAdhkarItem.content}

// ${currentAdhkarItem.transliteration}

// ${currentAdhkarItem.translation}

// 📖 ${currentAdhkarItem.source}

// Shared from DeenAI - ${categoryId === "morning" ? "Morning" : "Evening"} Adhkar
//       `.trim();

//       const result = await Share.share({
//         message: shareMessage,
//         title: `${categoryId === "morning" ? "Morning" : "Evening"} Adhkar`,
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           console.log("Shared successfully with:", result.activityType);
//         } else {
//           console.log("Shared successfully");
//         }
//       } else if (result.action === Share.dismissedAction) {
//         console.log("Share dismissed");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//       Alert.alert("Error", "Failed to share. Please try again.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <ScreenContainer>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#964B00" />
//         </View>
//       </ScreenContainer>
//     );
//   }

//   if (!currentAdhkarItem) {
//     return (
//       <ScreenContainer>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.loadingText}>Loading Adhkar...</Text>
//         </View>
//       </ScreenContainer>
//     );
//   }

//   const handleIncrement = () => {
//     if (!currentAdhkarItem) return;

//     if (currentCount < currentAdhkarItem.count) {
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//       incrementCount();
      
//       // Check if this increment completes all adhkar
//       const progress = getTotalProgress();
//       const allCompleted = progress.completed === progress.total;
      
//       if (allCompleted && isCompleted()) {
//         // Show completion message after a delay
//         setTimeout(() => {
//           Alert.alert(
//             "Completed! 🎉",
//             `Alhamdulillah! You have completed all ${categoryId} adhkar.`,
//             [{ text: "OK" }]
//           );
//         }, 1000);
//       }
//     }
//   };

//   const handleNext = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

//     if (currentIndex === currentAdhkar.length - 1) {
//       // If on last adhkar and all are completed, just go back
//       if (isCompleted()) {
//         router.back();
//       } else {
//         Alert.alert(
//           "Not Completed",
//           "Please complete all counts before moving on.",
//           [{ text: "OK" }]
//         );
//       }
//     } else {
//       nextAdhkar();
//     }
//   };

//   const handlePrevious = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     previousAdhkar();
//   };

//   const handleReset = () => {
//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
//     resetCount();
//   };

//   const handleStreakPress = () => {
//     router.push("/(adhkar)/streak-analytics");
//   };

//   // Fixed header component
//   const fixedHeader = (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
//       </TouchableOpacity>
//       <Text style={styles.headerTitle}>
//         {categoryId === "morning" ? "Morning Adhkar" : "Evening Adhkar"}
//       </Text>
//       <TouchableOpacity style={styles.streakButton} onPress={handleStreakPress}>
//         <Image
//           source={require("@/assets/images/streaks.png")}
//           style={styles.streakIcon}
//         />
//       </TouchableOpacity>
//     </View>
//   );

//   // Fixed footer component
//   const fixedFooter = (
//     <View style={styles.bottomContainer}>
//       <AdhkarCounter
//         current={currentCount}
//         total={currentAdhkarItem.count}
//         onIncrement={handleIncrement}
//         onPrevious={handlePrevious}
//         onNext={handleNext}
//         disablePrevious={currentIndex === 0}
//         disableNext={currentIndex === currentAdhkar.length - 1}
//       />
//     </View>
//   );

//   return (
//     <ScreenContainer
//       fixedHeader={fixedHeader}
//       fixedFooter={fixedFooter}
//       useFixedHeaderLayout={true}
//       paddingHorizontal={0}
//     >
//       <Image
//         source={
//           categoryId === "morning"
//             ? require("@/assets/images/adhkar/morning.png")
//             : require("@/assets/images/adhkar/evening.png")
//         }
//         style={styles.heroImage}
//       />

//       <View style={styles.titleContainer}>
//         <Text style={styles.adhkarTitle} numberOfLines={2}>
//           {currentAdhkarItem.source.split(".")[0] || "Adhkar"}
//         </Text>
//         <View style={styles.progressBadge}>
//           <View style={styles.progressTextContainer}>
//             <Text style={styles.progressCurrentNumber}>{currentIndex + 1}</Text>
//             <Text style={styles.progressTotalNumber}>
//               /{currentAdhkar.length}
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.contentCard}>
//         <Text style={styles.arabicText}>{currentAdhkarItem.content}</Text>

//         <Text style={styles.transliterationText}>
//           {currentAdhkarItem.transliteration}
//         </Text>

//         <Text style={styles.translationText}>
//           {currentAdhkarItem.translation}
//         </Text>

//         <View style={styles.referenceContainer}>
//           <View style={styles.referenceLeft}>
//             <Image
//               source={require("@/assets/images/adhkar/openbook.png")}
//               style={styles.bookIcon}
//             />
//             <Text style={styles.referenceText} numberOfLines={1}>
//               {currentAdhkarItem.source.split("(")[0].trim() || "Reference"}
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
//             <Ionicons name="share-social-outline" size={22} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Streak Complete Modal */}
//       <StreakCompleteModal
//         visible={showStreakCompleteModal}
//         onClose={handleCloseModal}
//         minutesSpent={getSessionDuration()}
//       />
//     </ScreenContainer>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     backgroundColor: "#fff",
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#1a1a1a",
//     fontFamily: theme.font.bold,
//   },
//   streakButton: {
//     padding: 4,
//   },
//   streakIcon: {
//     width: 25,
//     height: 25,
//     resizeMode: "contain",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     fontSize: 16,
//     color: "#666",
//   },
//   heroImage: {
//     width: width - 40,
//     height: 200,
//     resizeMode: "cover",
//     alignSelf: "center",
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     marginTop: 16,
//     marginHorizontal: 20,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     gap: 12,
//   },
//   adhkarTitle: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#0f0f0f",
//     lineHeight: 22,
//     fontFamily: theme.font.semiBold,
//   },
//   progressBadge: {
//     backgroundColor: "#964B00",
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     width: 87,
//     height: 49,
//   },
//   progressTextContainer: {
//     flexDirection: "row",
//     alignItems: "baseline",
//   },
//   progressCurrentNumber: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//     fontFamily: theme.font.semiBold,
//   },
//   progressTotalNumber: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     fontFamily: theme.font.semiBold,
//   },
//   contentCard: {
//     backgroundColor: "#Ffffff",
//     borderColor: "#E8e8e8",
//     borderWidth: 1,
//     marginHorizontal: 20,
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 60,
//   },
//   arabicText: {
//     fontSize: 22,
//     lineHeight: 36,
//     textAlign: "right",
//     color: "#3c3a35",
//     fontFamily: "AmiriQuran-Regular",
//     marginBottom: 20,
//   },
//   transliterationText: {
//     fontSize: 16,
//     lineHeight: 26,
//     color: "#3c3a35",
//     fontFamily: theme.font.regular,
//     marginBottom: 18,
//   },
//   translationText: {
//     fontSize: 16,
//     lineHeight: 26,
//     color: "#3c3a35",
//     marginBottom: 18,
//     fontFamily: theme.font.regular,
//   },
//   referenceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FBFAF8",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//   },
//   bookIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: "contain",
//   },
//   referenceLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     gap: 8,
//   },
//   referenceText: {
//     flex: 1,
//     fontSize: 13,
//     color: "#964B00",
//     fontWeight: "600",
//   },
//   shareButton: {
//     backgroundColor: "#964B00",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "visible",
//   },
//   bottomContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 24,
//   },
//   resetButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     paddingVertical: 12,
//     marginTop: 12,
//   },
//   resetText: {
//     color: "#964B00",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });