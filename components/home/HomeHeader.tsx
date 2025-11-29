import { useAuth, useLogout } from "@/hooks/useAuth";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function HomeHeader() {
  const { user, isGuest } = useAuth();
  const logoutMutation = useLogout();
  const router = useRouter();
  const userName = user?.name || (isGuest ? "Guest" : "User");
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const handleAvatarPress = () => {
    console.log(":red_circle: Avatar pressed, showing alert");
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutMutation.mutateAsync();
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },
      },
    ]);
  };
  
const handleNotificationPress = () => {
  router.push('/streak-complete'); // Your streak complete screen route
};
  const handleTasbihPress = () => {
    console.log("Navigating to Tasbih...");
    router.push("/(tasbih)");
  };
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <TouchableOpacity
          style={styles.avatar}
          onPress={handleAvatarPress}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarText}>{getInitials(userName)}</Text>
        </TouchableOpacity>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Assalam Alaykum</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
      <View style={styles.notifyButtons}>
        {/* <TouchableOpacity
          onPress={handleTasbihPress}
          style={styles.notificationButton}
        >
          <Image
            source={require("@/assets/images/tasbih.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.color.brand,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    color: theme.color.white,
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
  iconImage: {
    width: 27,
    height: 27,
    resizeMode: "contain",
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
