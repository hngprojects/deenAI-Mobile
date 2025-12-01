import ProfileAvatar from "@/components/ProfileAvatar";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
  const { t } = useTranslation();
  const { user, isGuest } = useAuth();
  const { data: userProfile } = useUser(); // Fetch user profile with avatar
  const logoutMutation = useLogout();
  const router = useRouter();

  const userName = user?.name || (isGuest ? "Guest" : "User");
  const userAvatar = userProfile?.avatar; // Get avatar from profile

  const handleAvatarPress = () => {
    // console.log(":red_circle: Avatar pressed, showing alert");
    // Alert.alert("Logout", "Are you sure you want to logout?", [
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //   },
    //   {
    //     text: "Logout",
    //     style: "destructive",
    //     onPress: async () => {
    //       try {
    //         await logoutMutation.mutateAsync();
    //       } catch (error) {
    //         console.error("Logout failed:", error);
    //       }
    //     },
    //   },
    // ]);

     router.push('/(tabs)/(profile)');

  };

  const handleNotificationPress = () => {
    router.push('/streak-complete');
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <TouchableOpacity
          onPress={handleAvatarPress}
          activeOpacity={0.7}
        >
          <ProfileAvatar
            avatar={userAvatar}
            name={userName}
            size={56}
          />
        </TouchableOpacity>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{t("greeting")}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
      <View style={styles.notifyButtons}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Bell size={20} color={theme.color.secondary} strokeWidth={2} />
          {!isGuest && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.color.background,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greeting: {
    gap: 2,
  },
  greetingText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: "#999",
  },
  userName: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
  notifyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 24,
    backgroundColor: theme.color.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    borderWidth: 1.5,
    borderColor: theme.color.white,
  },
});