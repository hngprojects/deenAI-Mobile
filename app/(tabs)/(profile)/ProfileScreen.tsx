import ScreenContainer from "@/components/ScreenContainer";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth-store";
import { theme } from "@/styles/theme";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SignOutConfirmationModal from "./delete/SignOut";
import { useQueryClient } from "@tanstack/react-query";

const { width } = Dimensions.get("window");

const icons = {
  left: {
    edit: require("@/assets/images/edit.png"),
    notifications: require("@/assets/images/notifications.png"),
    language: require("@/assets/images/language.png"),
    support: require("@/assets/images/support.png"),
    settings: require("@/assets/images/settings.png"),
    signout: require("@/assets/images/signout.png"),
    delete: require("@/assets/images/delete.png"),
  },
  right: require("@/assets/images/arrow-right.png"),
};

interface Option {
  id: string;
  title: string;
  route?: any;
  iconKey: keyof typeof icons.left;
  requiresAuth?: boolean; // NEW: Flag to indicate if auth is required
}

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const { data: userData, isLoading, refetch } = useUser();
  const { user: authUser, isGuest, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Refetch user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isGuest) {
        refetch();
      }
    }, [refetch, isGuest])
  );

  // Handle guest login (sign out from guest mode)
  const handleGuestLogin = () => {
    try {
      clearAuth();
      queryClient.clear();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Guest logout failed:", error);
      router.replace("/(auth)/login");
    }
  };

  const getAvatarSource = () => {
    if (userData?.avatar) {
      return { uri: userData.avatar };
    }
    return require("@/assets/images/woman-in-hijab.png");
  };

  const profileName = userData?.name || authUser?.name || "Guest";

  // Define all options with requiresAuth flag
  const allOptions: Option[] = [
    {
      id: "1",
      title: t('editProfile'),
      route: "/(tabs)/(profile)/EditProfileScreen",
      iconKey: "edit",
      requiresAuth: true,
    },
    {
      id: "2",
      title: t('notifications'),
      route: "/(tabs)/(profile)/NotificationScreen",
      iconKey: "notifications",
      requiresAuth: true,
    },
    {
      id: "3",
      title: t('selectLanguage'),
      route: "/(tabs)/(profile)/AppLanguageScreen",
      iconKey: "language",
      requiresAuth: false,
    },
    {
      id: "4",
      title: t('support'),
      route: "/(tabs)/(profile)/SupportScreen",
      iconKey: "support",
      requiresAuth: false,
    },
    {
      id: "5",
      title: isGuest ? 'Login' : t('logout'),
      route: "/(tabs)/(profile)/delete/SignOut",
      iconKey: "signout",
      requiresAuth: false,
    },
    {
      id: "6",
      title: t('deleteAccount'),
      route: "/(tabs)/(profile)/DeleteAccountScreen",
      iconKey: "delete",
      requiresAuth: true,
    },
  ];

  // Filter options based on authentication status
  const filteredOptions = allOptions.filter(option => {
    if (isGuest) {
      // For guests, only show options that don't require auth
      return !option.requiresAuth;
    }
    // For authenticated users, show all options
    return true;
  });

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.optionContainer}
      onPress={() => {
        if (item.id === "5") {
          // Handle Login/Logout based on guest status
          if (isGuest) {
            // For guests, log out and navigate to login screen
            handleGuestLogin();
          } else {
            // For authenticated users, show logout modal
            setSignOutModalVisible(true);
          }
        } else if (item.route) {
          router.push(item.route);
        }
      }}
    >
      <Image source={icons.left[item.iconKey]} style={styles.leftIconImage} />

      <Text style={[styles.optionText, { color: theme.color.secondary }]}>
        {item.title}
      </Text>

      <Image
        source={icons.right}
        style={styles.arrowIconImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  // Fixed Header Component
  const fixedHeader = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{t('profile')}</Text>
    </View>
  );

  // Show loading state while fetching profile (only for authenticated users)
  if (isLoading && !isGuest) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer
      fixedHeader={fixedHeader}
      useFixedHeaderLayout={true}
      paddingHorizontal={20}
      backgroundColor={theme.color.background}
    >
      <View style={styles.profileHeader}>
        <Image source={getAvatarSource()} style={styles.avatar} />
        <Text style={[styles.nameGreeting, { color: theme.color.secondary }]}>
          {t("greeting")} {profileName}, {"\n"}
          <Text style={styles.greeting}>{t("profileGreetings")}</Text>
        </Text>
      </View>

      <FlatList
        data={filteredOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderOption}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingHorizontal: 0, marginTop: 30 }}
      />

      {/* Only show sign out modal for authenticated users */}
      {!isGuest && (
        <SignOutConfirmationModal
          visible={signOutModalVisible}
          setVisible={setSignOutModalVisible}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: (width * 0.32) / 2,
  },
  nameGreeting: {
    fontSize: 18,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 22,
    textAlign: "center",
    fontFamily: theme.font.regular,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 11,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: theme.color.background,
  },
  leftIconImage: {
    width: 46,
    height: 46,
  },
  arrowIconImage: {
    marginLeft: "auto",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: theme.font.regular,
    marginLeft: 5,
  },
});

export default ProfileScreen;