import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { theme } from "@/styles/theme";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import PrimaryButton from "../primaryButton";

const listData = [
  {
    icon: require("@/assets/deen.png"),
    text: "Continue your personal guidance conversations with **DeenAi** anytime.",
  },
  {
    icon: require("@/assets/reflect.png"),
    text: "Securely save and organize your private **reflections** and spiritual notes.",
  },
  {
    icon: require("@/assets/quran.png"),
    text: "Bookmark your favorite **Quran** verses for quick and future reference.",
  },
];

const GuestUserModal = () => {
  const { isGuest } = useAuth();
  const { clearAuth } = useAuthStore();

  const handleSignUpClick = () => {
    // Logout the guest user
    clearAuth();
    // Redirect to onboarding
    router.replace("/(onboarding)/onboardingscreen");
  };

  const handleOverlayPress = () => {
    router.dismissAll();
  };

  return (
    <Modal transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalView}>
              {/* Deenai logo */}
              <Image
                source={require("@/assets/deen_ai_logo.png")}
                style={{ width: 60, height: 60, marginBottom: 16 }}
                contentFit="contain"
              />

              <View style={styles.contentContainer}>
                {/* cta text */}
                <Text style={styles.ctaText}>
                  To continue, your Journey requires a personalised Space, Sign
                  Up to:
                </Text>

                {/* list of benefits */}
                <View style={styles.listContainer}>
                  {listData.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <Image
                        source={item.icon}
                        style={styles.listIcon}
                        contentFit="contain"
                      />
                      {/* <Text style={styles.listText}>{item.text}</Text> */}
                      <Markdown style={{ body: styles.listText }}>
                        {item.text}
                      </Markdown>
                    </View>
                  ))}
                </View>

                {/* sign up button */}
                <PrimaryButton title="Sign Up" onPress={handleSignUpClick} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: theme.color.white,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5,
    gap: 20,
    marginHorizontal: 40,
    padding: 20,
    maxWidth: 400,
    width: "90%",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 500,
  },
  listContainer: {
    width: "100%",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    width: "100%",
  },
  listIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    lineHeight: 20,
    flexWrap: "wrap",
  },
});

export default GuestUserModal;
