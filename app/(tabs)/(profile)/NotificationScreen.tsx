import ScreenContainer from "@/components/ScreenContainer";
import Toggle from "@/components/ToggleNotifications";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationScreen() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([
    { id: 1, title: t("prayerReminder"), enabled: true },
    { id: 2, title: t("reflectionReminder"), enabled: false },
    { id: 3, title: t("deenAIMessageAlert"), enabled: true },
  ]);

  const toggleNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  // Fixed Header Component
  const fixedHeader = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color={theme.color.secondary} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Notifications</Text>

      <View style={styles.placeholder} />
    </View>
  );

  return (
    <ScreenContainer
      fixedHeader={fixedHeader}
      useFixedHeaderLayout={true}
      paddingHorizontal={20}
      backgroundColor={theme.color.background3}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            <Toggle
              value={item.enabled}
              onChange={() => toggleNotification(item.id)}
            />
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  content: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    paddingVertical: 19,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7C5CC",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: theme.color.secondary,
    fontFamily: theme.font.regular,
  },
});
