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

const profile: {
  options: Option[];
  avatar: any;
  name: string;
  greeting: string;
  nameGreeting: string;
} = {
  avatar: require("@/assets/images/woman-in-hijab.png"),
  name: "Aisha",
  nameGreeting: "Asalam Alaykum Aisha,\n",
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

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

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
  navbarImage: {
    position: "absolute",
    bottom: -32,
    width: "100%",
    height: 110,
    zIndex: 1,
    pointerEvents: "none",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "#0000004D",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    gap: 16,
  },
  modalTitle: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
    color: "#1a1a1a",
    fontFamily: theme.font.bold,
  },
  modalText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
  },
  modalButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderColor: "#1a1a1a",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: "#1a1a1a",
  },
  deleteButton: {
    backgroundColor: "#E55153",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});

export default ProfileScreen;
