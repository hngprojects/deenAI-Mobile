import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ScreenHeader from '../screenHeader';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Support" />

      <View style={styles.list}>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile/support/faq')}
        >
          <Text style={styles.title}>Contact Us</Text>
          <Image
            source={require('../../assets/images/arrow-right.png')}
            style={styles.arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile/support/faq')}
        >
          <Text style={styles.title}>Frequent Questions</Text>
          <Image
            source={require('../../assets/images/arrow-right.png')}
            style={styles.arrow}
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  list: { marginTop: 20, paddingHorizontal: 16 },

  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.secondary,
  },

  arrow: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
