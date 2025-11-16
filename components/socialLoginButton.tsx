import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { SocialProvider } from '../types';
import { theme } from '../styles/theme';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
}) => {
  const config: Record<SocialProvider, { text: string; icon: ImageSourcePropType }> = {
    apple: {
      text: 'Continue with Apple',
      icon: require('../assets/images/Apple.png'),
    },
    google: {
      text: 'Continue with Google',
      icon: require('../assets/images/Google.png'),
    },
  };

  const { text, icon } = config[provider];

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    fontWeight: '500',
  },
});

export default SocialLoginButton;