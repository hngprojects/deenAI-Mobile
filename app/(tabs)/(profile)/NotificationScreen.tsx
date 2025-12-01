import { theme } from '@/styles/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import Toggle from '@/components/ToggleNotifications';
import ScreenTitle from '@/components/ScreenTitle';
import ScreenHeader from '@/components/screenHeader';
import { router } from 'expo-router';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Prayer Reminder", enabled: true },
    { id: 2, title: "Reflection Reminder", enabled: false },
    { id: 3, title: "Deen AI Message Alert", enabled: true },
  ]);

  const toggleNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Notifications"  onBackPress={() => router.push('/(tabs)/(profile)/ProfileScreen')}/>

      <ScrollView contentContainerStyle={styles.content}>
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
  content: { padding: 16, paddingTop: 20},

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
