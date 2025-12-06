import PaymentScreen from "@/components/payments/PaymentScreen";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <ScreenHeader
        title="Upgrade your Plan"
        onBackPress={handleBackPress}
        headerStyle={{
          backgroundColor: "transparent",
          marginBottom: 0,
          paddingVertical: 12,
        }}
        titleStyle={{
          backgroundColor: "transparent",
        }}
      />
      <ScreenContainer scrollable paddingHorizontal={0}>
        <PaymentScreen />
      </ScreenContainer>
    </SafeAreaView>
  );
};

export default index;
