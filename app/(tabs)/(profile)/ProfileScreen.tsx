import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SignOutConfirmationModal from "./delete/SignOut";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth-store";

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
}

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const { data: userData, isLoading, refetch } = useUser(); // ✅ Added refetch
  const { user: authUser } = useAuthStore();

  // ✅ FIX: Show selected avatar immediately if available
  const getAvatarSource = () => {
    if (userData?.avatar) {
      return { uri: userData.avatar };
    }
    return require("@/assets/images/woman-in-hijab.png");
  };

  const profile = {
    avatar: getAvatarSource(),
    name: authUser?.name || "User",
    nameGreeting: `Asalam Alaykum ${authUser?.name || "User"},\n`,
    greeting: "May all your days be filled with Light.",
    options: [
      {
        id: "1",
        title: "Edit Profile",
        route: "/(tabs)/(profile)/EditProfileScreen",
        iconKey: "edit",
      },
      {
        id: "2",
        title: "Notifications",
        route: "/(tabs)/(profile)/NotificationScreen",
        iconKey: "notifications",
      },
      {
        id: "3",
        title: "Language",
        route: "/(tabs)/(profile)/AppLanguageScreen",
        iconKey: "language",
      },
      {
        id: "4",
        title: "Support",
        route: "/(tabs)/(profile)/SupportScreen",
        iconKey: "support",
      },
      {
        id: "5",
        title: "Log Out",
        route: "/(tabs)/(profile)/delete/SignOut",
        iconKey: "signout",
      },
      {
        id: "6",
        title: "Delete Account",
        route: "/(tabs)/(profile)/DeleteAccountScreen",
        iconKey: "delete",
      },
    ],
  };

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.optionContainer}
      onPress={() => {
        if (item.id === "5") {
          setSignOutModalVisible(true);
        } else if (item.route) {
          router.push(item?.route);
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

  return (
    <View>
      <View style={styles.header}>
        <Image source={profile.avatar} style={styles.avatar} />
        <Text style={[styles.nameGreeting, { color: theme.color.secondary }]}>
          {profile.nameGreeting}
          <Text style={styles.greeting}>{profile.greeting}</Text>
        </Text>
      </View>

      <FlatList
        data={profile.options}
        keyExtractor={(item) => item.id}
        renderItem={renderOption}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingHorizontal: 8, marginTop: 30 }}
      />

      <SignOutConfirmationModal
        visible={signOutModalVisible}
        setVisible={setSignOutModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 36,
  },
  avatar: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: (width * 0.32) / 2,
  },
  nameGreeting: {
    fontSize: 20,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
  },
  greeting: {
    fontSize: 20,
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