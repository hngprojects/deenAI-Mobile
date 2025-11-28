import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import React from "react";

const Qibla = () => {
  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      <ScreenHeader
        title="Qibla Direction"
        headerStyle={{
          paddingHorizontal: 0,
        }}
      />
    </ScreenContainer>
  );
};

export default Qibla;
