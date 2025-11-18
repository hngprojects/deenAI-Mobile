import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import ScreenHeader from '../screenHeader';
import { theme } from '@/styles/theme';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Prayer Reminder", enabled: true },
    { id: 2, title: "Reflection Reminder", enabled: false },
    { id: 3, title: "Noor AI Message Alert", enabled: true },
  ]);

  const toggleNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <ScreenHeader title="Notifications" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            <Switch
              value={item.enabled}
              onValueChange={() => toggleNotification(item.id)}
              trackColor={{ false: "#CCC", true: "#CCC" }} 
              thumbColor="#FFF"
              ios_backgroundColor="#CCC"
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.5 }] }} 
            />
         </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },

  headerWrapper: { marginTop: 20 },

  content: { padding: 16, paddingTop: 10 },

  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#F4F4F4",
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "700", color: theme.color.secondary },
});
