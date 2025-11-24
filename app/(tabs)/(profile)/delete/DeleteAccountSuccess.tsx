import ScreenContainer from '@/components/ScreenContainer';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View, } from 'react-native';

export default function DeleteAccountSuccess() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <View style={styles.container} >

        <Image
          source={require("@/assets/images/success-check.png")}
          style={styles.icon}
          resizeMode="contain"
        />

        <Text style={styles.textHeader}>Accounted Deleted Successfully</Text>
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  textHeader: {
    fontSize: 26,
    fontFamily: theme.font.extraBold,
    textAlign: "center",
    color: '#3C3A35',
    lineHeight: 34,
    marginTop: 24,
    paddingLeft: 61,
    paddingRight: 61,
  },
  icon:{
    width: 110,
    height: 110,
  }
})