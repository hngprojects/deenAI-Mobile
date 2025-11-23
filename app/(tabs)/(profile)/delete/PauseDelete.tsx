// components/profile/ProfilePauseCardOverlay.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import ProfileScreen from '../ProfileScreen';

const PauseDeleteOverlay: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* PROFILE SCREEN WITH 50% OPACITY */}
      <View style={styles.profileWrapper}>
        <ProfileScreen />
      </View>

      {/* POP-UP CARD */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Did you know?</Text>

          <Text style={styles.cardText}>
            You can pause notifications or sign out temporarily{"\n"}
            instead of deleting your data. {"\n"}
            You won’t lose your saved reflections or chats {"\n"}
            if you choose to come back later.
          </Text>

          <View style={styles.cardButtonWrapper}>
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={() => router.push('/(tabs)/(profile)/ProfileScreen')}
            >
              <Text style={styles.pauseButtonText}>Pause My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButtonCard]}
            >
              <Text style={styles.deleteButtonTextCard}>Yes, Delete My Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PauseDeleteOverlay;

const styles = StyleSheet.create({
  profileWrapper: {
    flex: 1,
    opacity: 0.5, 
  },

  cardContainer: {
    position: 'absolute',
    top: '28%',
    left: 20,
    right: 20,
    zIndex: 2,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center', 
  },

  cardTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 15, 
    color: '#000',
    textAlign: 'center',
  },

  // Body centered
  cardText: { 
    fontSize: 14, 
    color: '#000', 
    marginBottom: 20,
    textAlign: 'center',  
    lineHeight: 20,
  },

  cardButtonWrapper: {
    width: '100%',
    flexDirection: 'column', 
    gap: 15,
  },

  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  pauseButton: { backgroundColor: '#F2393C' },
  pauseButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  deleteButtonCard: { 
    backgroundColor: theme.color.background, 
    borderWidth: 1, 
    borderColor: '#000' 
  },
  deleteButtonTextCard: { 
    color: '#000', 
    fontWeight: '700', 
    fontSize: 14 
  },
});
