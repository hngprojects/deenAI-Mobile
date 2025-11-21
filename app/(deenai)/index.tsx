import StarterPrompts from "@/components/deen-ai/StarterPrompts";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { Book, Mic, Send } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

// const messages = [
//   {
//     id: '1',
//     message:
//       'Hi NoorAi, i have been feeling alot of anxiety lately due to some challenges, i am stucked fr.',
//     role: 'user',
//     timestamp: '2023-10-01T10:00:00Z',
//   },
//   {
//     id: '2',
//     message: `Allah told us that life comes with tests, not to break us, but to strengthen our hearts. Sometimes what you face is part of His plan to draw you closer.

// Be patient, stay calm, and trust in His mercy, for He has promised ease not once, but twice:

// "Indeed, with hardship comes ease. Indeed, with hardship comes ease." — Surah Ash-Sharh (94:5-6)

// Start Here: Surah Ash-Sharh (94:5-6)`,
//     timestamp: '2023-10-01T10:00:05Z',
//     role: 'deenai',
//   },
// ];

export default function index() {
  return (
    <>
      <ScreenContainer
        backgroundColor={theme.color.background2}
        scrollable={true}
        showsVerticalScrollIndicator={false}
        paddingHorizontal={0}
        contentContainerStyle={styles.contentContainer}
      >
        <ScreenHeader
          title="DEEN AI"
          titleAlign="center"
          rightComponent={
            <TouchableOpacity>
              <View style={styles.historyButton}>
                <Book color={theme.color.black} size={24} />
              </View>
            </TouchableOpacity>
          }
        />
        {/* Starter prompts */}
        <StarterPrompts />
        {/* Messages - will go here */}
      </ScreenContainer>

      {/* Input form - outside ScrollView for fixed position */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <View style={styles.inputFieldContainer}>
            <TextInput
              style={{ flex: 1, height: "100%" }}
              placeholder="Ask Deen AI"
            />

            <TouchableOpacity>
              <Mic color={theme.color.gray} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButtonContainer}>
            <Send fill={theme.color.primary} color={theme.color.background} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingInline: 20,
    flexGrow: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.color.background2,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  inputFieldContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.color.gray,
    paddingHorizontal: 18,
  },
  sendButtonContainer: {
    height: 46,
    width: 46,
    borderRadius: 12,
    backgroundColor: theme.color.brand,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  historyButton: {
    padding: 8,
    borderRadius: "100%",
    backgroundColor: theme.color.gray,
  },
});
