import OutlineButton from '@/components/OutlineButton';
import SecondaryButton from '@/components/secondaryButton';
import TextLink from '@/components/textLink';
import { useAuth, useGuestLogin } from '@/hooks/useAuth';
import { theme } from '@/styles/theme';
import { Redirect, useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const { mutate: continueAsGuest, isPending } = useGuestLogin();

  if (!isLoading && (isAuthenticated || isGuest)) {
    return <Redirect href="/(tabs)" />;
  }

  const handleGuestLogin = () => {
    continueAsGuest();
  };

  if (isLoading) {
    return null;
  }

  return (
    <ImageBackground
      source={require("../assets/images/onb.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.screenContainer}>
        <View style={styles.containerBoard}>
          <View style={styles.boardText}>
            <Text style={styles.bText}>
              Welcome to Deen AI, Converse & Learn
            </Text>
            <Text style={styles.pText}>
              A peaceful space to connect with the Quran every day. Seek
              answers, find light, and reflect in stillness.
            </Text>
          </View>

          <SecondaryButton
            title="Create an Account"
            onPress={() => router.push("/(auth)/signup")}
          />

          <OutlineButton
            title={isPending ? "Continuing..." : "Continue as a Guest"}
            onPress={handleGuestLogin}
            disabled={isPending}
            style={{ marginTop: 20 }}
          />

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TextLink
              label="Already have an account?"
              linkText=" Log in"
              onPress={() => router.push("/(auth)/login")}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  containerBoard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  boardText: {
    marginBottom: 30,
  },
  bText: {
    fontFamily: theme.font.black,
    fontSize: 31,
    color: theme.color.white,
    lineHeight: 32,
    marginBottom: 16,
  },
  pText: {
    fontFamily: theme.font.regular,
    fontSize: 16,
    color: theme.color.white,
    lineHeight: 24,
  },
});
