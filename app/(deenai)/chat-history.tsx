import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet } from "react-native";

const ChatHistory = () => {
  return (
    <ScreenContainer
      backgroundColor={theme.color.background2}
      scrollable={true}
      showsVerticalScrollIndicator={false}
      paddingHorizontal={0}
      contentContainerStyle={styles.contentContainer}
    >
      <ScreenHeader title="Chat History" />
    </ScreenContainer>
  );
};

export default ChatHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingInline: 20,
    flexGrow: 1,
  },
});
