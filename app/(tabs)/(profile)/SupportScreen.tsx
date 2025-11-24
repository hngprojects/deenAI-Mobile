import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../../../components/screenHeader';
import ScreenContainer from '@/components/ScreenContainer';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
    <ScreenHeader title="Support" />

      <View style={styles.list}>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/(tabs)/(profile)/support/ContactScreen')}
        >
          <Text style={styles.title}>Contact Us</Text>
          <Image
            source={require('@/assets/images/arrow-right.png')}
            style={styles.arrow}
            resizeMode ='contain'
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/(tabs)/(profile)/support/FAQScreen')}
        >
          <Text style={styles.title}>Frequent Asked Questions</Text>
          <Image
            source={require('@/assets/images/arrow-right.png')}
            style={styles.arrow}
            resizeMode ='contain'
          />
        </TouchableOpacity>

      </View>
    </ScreenContainer>
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
    borderWidth: 1,
    borderColor: '#C7C5CC'
  },

  title: {
    fontSize: 16,
    color: theme.color.secondary,
    fontFamily: theme.font.regular
  },

  arrow: {
    width: 24,
    height: 24,
  },
});
