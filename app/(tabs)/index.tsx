import ScreenContainer from "@/components/ScreenContainer";
import StreakBottomDrawer from "@/components/adhkar/StreakBottomDrawer";
import DailyReflection from "@/components/home/DailyReflection";
import HomeHeader from "@/components/home/HomeHeader";
import QuickActions from "@/components/home/QuickActions";
import UpcomingSolat from "@/components/home/UpcomingSolat";
import { useStreakStore } from "@/store/streak-store";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [showStreakDrawer, setShowStreakDrawer] = useState(false);
  const { hasSeenDrawerToday, checkStreakStatus } = useStreakStore();

  useEffect(() => {
    // Check streak status when screen loads
    checkStreakStatus();

    // Show drawer if user hasn't seen it today
    if (!hasSeenDrawerToday) {
      // Small delay for better UX
      setTimeout(() => {
        setShowStreakDrawer(true);
      }, 500);
    }
  }, [hasSeenDrawerToday, checkStreakStatus]);

  const handleFabPress = () => {
    router.push("/(deenai)");
  };

  const handleCloseDrawer = () => {
    setShowStreakDrawer(false);
  };

  return (
    <>
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
          </View>
        </View>

        {/* Streak Bottom Drawer */}
        <StreakBottomDrawer
          visible={showStreakDrawer}
          onClose={handleCloseDrawer}
        />
      </ScreenContainer>
      {/* FAB Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} onPress={handleFabPress}>
          <Image
            source={require("@/assets/deen.png")}
            style={{ height: 65, width: 65, borderRadius: 30 }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    // paddingBottom: 100,
  },
  content: {
    gap: 24,
    position: "relative",
    paddingTop: 10,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.color.background,
  },
  fabContainer: {
    height: 65,
    width: 65,
    borderRadius: 100,
    position: "absolute",
    bottom: 100,
    right: 20,
    elevation: 5,
  },
  fabButton: {
    height: 65,
    width: 65,
    borderRadius: 100,
  },
});
