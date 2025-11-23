// components/profile/ProfileScreen.tsx
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
<<<<<<< HEAD:components/profile/ProfileScreen.tsx
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import ScreenContainer from "../ScreenContainer";

const { width } = Dimensions.get("window");
=======
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// type FeatherIconName = keyof typeof Icon.glyphMap;

const icons = {
  left: {
    edit: require('@/assets/images/edit.png'),
    notifications: require('@/assets/images/notifications.png'),
    language: require('@/assets/images/language.png'),
    support: require('@/assets/images/support.png'),
    settings: require('@/assets/images/settings.png'),
    signout: require('@/assets/images/signout.png'),
    delete: require('@/assets/images/delete.png'),
  },
  right: require('@/assets/images/arrow-right.png'),
};
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx

interface Option {
  id: string;
  title: string;
  route?: any;  
  iconKey: keyof typeof icons.left;
}

<<<<<<< HEAD:components/profile/ProfileScreen.tsx
const icons = {
  left: {
    edit: require("../../assets/images/edit.png"),
    notifications: require("../../assets/images/notifications.png"),
    language: require("../../assets/images/language.png"),
    support: require("../../assets/images/support.png"),
    settings: require("../../assets/images/settings.png"),
    signout: require("../../assets/images/signout.png"),
    delete: require("../../assets/images/delete.png"),
  },
  right: require("../../assets/images/arrow-right.png"),
};

const profile = {
  avatar: require("../../assets/images/woman-in-hijab.png"),
  name: "Aisha",
  greeting: "Asalam alaykum Aisha,\nMay your days be filled with light.",

  options: [
    { id: "1", title: "Edit Profile", route: "/profile/edit", iconKey: "edit" },
    {
      id: "2",
      title: "Notifications",
      route: "/profile/notification",
      iconKey: "notifications",
    },
    {
      id: "3",
      title: "Language",
      route: "/profile/language",
      iconKey: "language",
    },
    {
      id: "4",
      title: "Support",
      route: "/profile/support",
      iconKey: "support",
    },
    { id: "5", title: "Settings", route: "/settings", iconKey: "settings" },
    {
      id: "6",
      title: "Sign Out",
      route: "/profile/signout",
      iconKey: "signout",
    },
    {
      id: "7",
      title: "Delete Account",
      route: "/profile/delete",
      iconKey: "delete",
    },
=======
const profile: { options: Option[]; avatar: any; name: string; greeting: string } = {
  avatar: require("@/assets/images/woman-in-hijab.png"),
  name: 'Aisha',
  greeting: 'Asalam alaykum Aisha,\nMay all your days be filled with Light.',
  options: [
    { id: '1', title: 'Edit Profile', route: '/(tabs)/(profile)/EditProfileScreen', iconKey: 'edit' },
    { id: '2', title: 'Notifications', route: '/(tabs)/(profile)/NotificationScreen', iconKey: 'notifications' },
    { id: '3', title: 'Language', route: '/(tabs)/(profile)/AppLanguageScreen', iconKey: 'language' },
    { id: '4', title: 'Support', route: '/(tabs)/(profile)/SupportScreen', iconKey: 'support' },
    // { id: '5', title: 'Settings', route: '/(tabs)/(profile)/SupportScreen', iconKey: 'settings' },
    { id: '5', title: 'Sign Out', route: '/(tabs)/(profile)/signout', iconKey: 'signout' },
    { id: '6', title: 'Delete Account', route: '/(tabs)/(profile)/DeleteAccountScreen', iconKey: 'delete' },
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  ],
};


const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => item?.route && router.push(item?.route)}
    >
      <View style={styles.leftIconWrapper}>
        <Image source={icons.left[item.iconKey]} style={styles.leftIconImage} />
      </View>

      <Text style={[styles.optionText, { color: theme.color.secondary }]}>
        {item.title}
      </Text>

      <View style={styles.rightArrowWrapper}>
        <Image
          source={icons.right}
          style={styles.arrowIconImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
        <View style={styles.header}>
          <Image source={profile.avatar} style={styles.avatar} />
          <Text style={[styles.greeting, { color: theme.color.secondary }]}>
            {profile.greeting}
          </Text>
<<<<<<< HEAD:components/profile/ProfileScreen.tsx

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.color.brand }]}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={[styles.editButtonText, { color: theme.color.white }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
=======
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
        </View>

      <FlatList
        data={profile.options}
        keyExtractor={(item) => item.id}
        renderItem={renderOption}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false} // hides vertical scrollbar
        showsHorizontalScrollIndicator={false} // hides horizontal scrollbar
        contentContainerStyle={{ paddingHorizontal: 20, marginTop: 30 }}
      />

<<<<<<< HEAD:components/profile/ProfileScreen.tsx
        <Image
          source={require("../../assets/images/NOOR NAV.png")}
          style={styles.navbarImage}
          resizeMode="cover"
        />
      </ScrollView>
    </ScreenContainer>
=======
    </View>
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
<<<<<<< HEAD:components/profile/ProfileScreen.tsx
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
=======
    alignItems: 'center',
    marginTop: 16,
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  },
  avatar: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: (width * 0.32) / 2,
  },
  greeting: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    lineHeight: 26,
<<<<<<< HEAD:components/profile/ProfileScreen.tsx
    fontWeight: "600",
=======
    fontWeight: '600',
    fontFamily: theme.font.regular
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 15,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionContainer: {
<<<<<<< HEAD:components/profile/ProfileScreen.tsx
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 0.6,
    borderColor: "#FFFFFF",
=======
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 6,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: theme.color.background
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  },
  leftIconWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  leftIconImage: {
    width: 24,
    height: 24,
  },
  rightArrowWrapper: {
    marginLeft: "auto",
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIconImage: {
    width: 22,
    height: 22,
  },
  optionText: {
    fontSize: 16,
<<<<<<< HEAD:components/profile/ProfileScreen.tsx
    fontWeight: "500",
=======
    fontWeight: '500',
    fontFamily: theme.font.regular
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/ProfileScreen.tsx
  },
  navbarImage: {
    position: "absolute",
    bottom: -32,
    width: "100%",
    height: 110,
    zIndex: 1,
    pointerEvents: "none",
  },
});
