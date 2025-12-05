import { useLogout } from '@/hooks/useAuth';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GuestReflectionCard() {

  const logoutMutation = useLogout();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Navigate to signup screen
      router.push('/(auth)/signup' as any);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.reflectionCard}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.image}
      />
      <Text style={styles.titleText}>
        To continue, your Journey requires a personalised Space,{" "}
        <Text style={styles.bold}>Sign Up</Text> to:
      </Text>

      <View style={styles.benefitCard}>
        <Image
          source={require('@/assets/images/guest-card.png')}
          style={styles.benefitImage}
        />
        <Text style={styles.benefitText}>
          Continue your personal guidance conversations with{" "}
          <Text style={styles.bold}>DeenAI</Text> anytime.
        </Text>
      </View>

      <View style={styles.benefitCard}>
        <Image
          source={require('@/assets/images/guest-card-2.png')}
          style={styles.benefitImage}
        />
        <Text style={styles.benefitText}>
          Securely save and organize your private <Text style={styles.bold}>reflections</Text> and spiritual notes.
        </Text>
      </View>

      <View style={styles.benefitCard}>
        <Image
          source={require('@/assets/images/guest-card-3.png')}
          style={styles.benefitImage}
        />
        <Text style={styles.benefitText}>
          Bookmark your favorite <Text style={styles.bold}>Quran</Text> verses for quick and future reference.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.signUpButton}
        onPress={handleSignUp}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  reflectionCard: {
    paddingVertical: 20,
    paddingHorizontal: 29,
    borderWidth: 1,
    backgroundColor: theme.color.background,
    borderColor: '#D0CCCC',
    gap: 13,
    marginTop: 24,
    marginBottom: 31.5,
    borderRadius: 8,
  },
  image: {
    width: 100,  
    height: 41,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 12,
    fontFamily: theme.font.semiBold,
    color: '#737373',
    // textAlign: 'center',
    lineHeight: 18,
  },
  bold: {
    fontFamily: theme.font.bold,
    fontWeight: '700',
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  benefitImage: {
    width: 25,  
    height: 25,
    marginTop: 2, 
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontFamily: theme.font.semiBold,
    color: '#737373',
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: theme.color.brand,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  signUpButtonText: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});