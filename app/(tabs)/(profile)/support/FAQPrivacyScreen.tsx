import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenHeader from "../../../../components/screenHeader";
import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { router } from "expo-router";

export default function PrivacyScreen() {
  return (
 
   <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Frequently Asked Questions"  onBackPress={() => router.push('/(tabs)/(profile)/support/FAQScreen')}/>

      <View>  
      <Text style={styles.text}>
        Your privacy and peace of mind are very important to us. Every chat,
        reflection, and saved note within DeenAi is stored securely and kept
        strictly private.DeenAi does not share, sell, or use your personal
        data for advertising.
      </Text>

      <Text style={styles.text}>
        Your reflections are yours alone, only you can view or delete them. We
        also use secure encryption methods to protect all stored information
        and ensure that your conversations with DeenAi remain confidential.
      </Text>
    </View>
  </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  text: {
    fontSize: 18,
    lineHeight: 29,
    color: "#444",
    marginBottom: 20,
    fontWeight: "400"
  }
});
