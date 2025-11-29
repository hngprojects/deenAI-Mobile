import { useAuth, useLogout } from "@/hooks/useAuth";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Drawer + Modal UI
import BottomDrawer from "@/components/BottomDrawer";
import WelcomeDrawer from "@/components/WelcomeDrawer";

export default function HomeHeader() {
  const { user, isGuest } = useAuth();
  const logoutMutation = useLogout();
  const router = useRouter();

  const [showDrawer, setShowDrawer] = React.useState(false);

  const userName = user?.name || (isGuest ? "Guest" : "User");
  const streakCount = 3; // TEMP VALUE — replace with real user streak

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarPress = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
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
    console.log("Notifications pressed");
  };

  const handleTasbihPress = () => {
    router.push("/(tasbih)");
  };

  const handleStreakPress = () => {
    router.push("/(adhkar)/AzkarStreakCalender");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          {/* AVATAR */}
          <TouchableOpacity
            style={styles.avatar}
            onPress={handleAvatarPress}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </TouchableOpacity>

          {/* GREETING + USERNAME */}
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Assalam Alaykum</Text>

            {/* USERNAME opens drawer */}
            <TouchableOpacity onPress={() => setShowDrawer(true)}>
              <Text style={styles.userName}>{userName}</Text>
            </TouchableOpacity>

            {/* STREAK BADGE */}
            <TouchableOpacity
              style={styles.streakBadge}
              onPress={handleStreakPress}
              activeOpacity={0.8}
            >
              <Image
                source={require("@/assets/icons/flame.png")}
                style={{ width: 14, height: 14 }}
              />
              <Text style={styles.streakText}>{streakCount} days</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT BUTTONS */}
        <View style={styles.notifyButtons}>
          <TouchableOpacity
            onPress={handleTasbihPress}
            style={styles.notificationButton}
          >
            <Image
              source={require("@/assets/images/tasbih.png")}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Bell size={24} color={theme.color.secondary} strokeWidth={2} />
            {!isGuest && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* DRAWER MODAL */}
      <BottomDrawer visible={showDrawer} onClose={() => setShowDrawer(false)}>
        <WelcomeDrawer onClose={() => setShowDrawer(false)} />
      </BottomDrawer>
    </>
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

  /* STREAK BADGE EXACT REPLICA */
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F2EC",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  streakText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.color.brand,
    fontFamily: theme.font.regular,
  },

  notifyButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconImage: {
    width: 27,
    height: 27,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.color.white,
    justifyContent: "center",
    alignItems: "center",
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
