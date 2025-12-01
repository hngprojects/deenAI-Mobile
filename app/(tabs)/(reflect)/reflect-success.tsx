import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../../components/primaryButton";

type ReflectStackParamList = {
  'reflect-success': undefined;
  'index': undefined;
  'saved-reflection': undefined;
};

type ReflectSuccessProp = NativeStackNavigationProp<ReflectStackParamList, 'reflect-success'>;

export default function ReflectSuccess() {
  const navigation = useNavigation<ReflectSuccessProp>();
  const { t } = useTranslation();
  
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/refl.png")}
          style={styles.icon}
          resizeMode="contain"
        />

        <Text style={styles.textHeader}>{t("reflectSuccessHeader")}</Text>

        <Text style={styles.containerText}>
          {t("reflectSuccessText")}
        </Text>

        <PrimaryButton
          title={t("openReflectionJournal")}
          onPress={() => navigation.replace("saved-reflection")}
          style={styles.button}
        />

        <Text
          style={styles.backText}
          onPress={() => navigation.navigate("index")}
        >
         {t("reflectSuccessButton")}
        </Text>
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
    color: "#3C3A35",
    lineHeight: 34,
    marginTop: 24,
    paddingLeft: 61,
    paddingRight: 61,
  },
  containerText: {
    fontSize: 18,
    textAlign: "center",
    color: "#3C3A35",
    lineHeight: 30,
    marginTop: 24,
    paddingLeft: 27,
    paddingRight: 27,
    fontFamily: theme.font.regular,
  },
  button: {
    marginTop: 40,
  },
  backText: {
    textAlign: "center",
    color: "#5E5B54",
    fontSize: 12,
    marginTop: 10,
  },
  icon: {
    width: 110,
    height: 110,
  },
});
