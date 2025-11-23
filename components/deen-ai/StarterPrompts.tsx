import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import PromptButton from "./PromptButton";

const prompts = [
  "Verse to console me",
  "What was the revelation of Surat Duha",
  "Surah Mulk importance",
];

export default function StarterPrompts({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  return (
    <View style={styles.container}>
      {prompts.map((prompt, index) => (
        <PromptButton key={index} prompt={prompt} setMessage={setMessage} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  promptButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    backgroundColor: theme.color.background,
    paddingBlock: 10,
    paddingInline: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.color.border,
    color: theme.color.paragraph,
  },
});
