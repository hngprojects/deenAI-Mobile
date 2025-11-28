import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

const Qibla = () => {
  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      <ScreenHeader
        title="Qibla Direction"
        headerStyle={{
          paddingHorizontal: 0,
        }}
      />

      <View style={styles.qiblaContainer}>
        {/* Phone Up Point */}
        <LinearGradient
          colors={[theme.color.gradientStart, theme.color.brand]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.phoneUpPointContainer}
        />
        {/* Compass */}
        <View style={styles.compassContainer}>
          <Image
            style={{ width: 250, height: 250, objectFit: "contain" }}
            source={require("@/assets/compass.png")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  qiblaContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
    flex: 1,
  },
  phoneUpPointContainer: {
    width: 15,
    height: 15,
    borderRadius: 999,
  },
  compassContainer: {
    padding: 20,
    // width: 300,
    // height: 300,
    alignItems: "center",
    justifyContent: "center",
    objectFit: "contain",
    transformOrigin: "center",
    transform: [{ rotate: "32.09deg" }],
  },
});

export default Qibla;
