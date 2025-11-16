import React from "react";
import {Text, TouchableOpacity, StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/primaryButton";
import { ArrowLeft, Bell } from "lucide-react-native";
import PrimaryButton2 from "@/components/primaryButton2";

export default function NotificationsAccess() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#222"/>
        </TouchableOpacity>

        {/* Bell Icon */}
        <Bell size={96} color="#964B00" style={styles.bellIcon}/>
      </View>

      {/* Title */}
      <Text style={styles.title}>Allow NoorAi to send Notifications?</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Notifications may include alerts, sounds, and adan. These can be changed in settings.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonsWrapper}>
        <PrimaryButton
          title="Allow"
          onPress={() => router.push("/access-screens/NotificationsAccess")}
        />
        <PrimaryButton2
          title="Don't Allow"
          onPress={() => router.push("/login/Login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    backgroundColor: "#fff",
  },

  topSection: {
    marginTop: 60, // space from top of screen
    alignItems: "center",
    marginBottom: 40, // space between icon and title
  },

  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
  },

  bellIcon: {
    marginTop: 20, // space below back button
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 12,
  },

  buttonsWrapper: {
    width: "100%",
    marginTop: 10,
    gap: 12, // space between Allow and Don't Allow buttons
  },
});

