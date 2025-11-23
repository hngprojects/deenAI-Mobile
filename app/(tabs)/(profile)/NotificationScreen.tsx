import { theme } from '@/styles/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import ScreenHeader from '../../../components/screenHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { ToggleLeftIcon } from 'lucide-react-native';

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
      <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Notifications" />

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            <Switch
              value={item.enabled}
              onValueChange={() => toggleNotification(item.id)}
              trackColor={{
                false: "#D0D0D0",  
                true: "#D0D0D0",
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D0D0D0"
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.5 }] }}
            />

          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },

  headerWrapper: { marginTop: 20 },

  content: { padding: 16, paddingTop: 20 },

  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#C7C5CC'
    
  },
  title: { fontSize: 16,  color: theme.color.secondary, fontFamily:theme.font.regular},
});
