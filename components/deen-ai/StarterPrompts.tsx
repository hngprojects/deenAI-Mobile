import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import PromptButton from "./PromptButton";

const prompts = [
  "Verse to console me",
  "What was the revelation of Surat Duha",
  "Surah Mulk importance",
  "Give me a short reflection from the Quran",
  "Teach me a dua I can use today",
  "Share a reminder about patience",
  "What does Islam say about gratitude",
  "Give me a hadith about kindness",
  "Explain a name of Allah",
  "Share a verse that increases hope",
  "Give me a lesson from the life of the Prophet",
  "Help me reflect on my intentions",
  "What does the Quran teach about humility",
  "Give me a hadith about good character",
  "Share a Quranic view on trusting Allah",
  "Remind me of an action that brings reward",
  "Explain a verse about mercy",
  "Teach me something from the story of Musa",
  "Give me a short tafsir of a verse",
  "Share a reminder that calms anxiety",
  "Help me learn a Quranic Arabic word",
  "What is the wisdom behind trials in Islam",
  "Tell me something inspiring from Seerah",
  "Help me strengthen my iman today",
  "Give me a hadith that motivates consistency",
  "Share a verse about gratitude",
  "Give me a reflection for my morning",
  "Give me a reflection for my night",
  "Tell me a verse about forgiveness",
  "Help me reflect on my relationship with the Quran",
  "What does Islam say about justice",
  "Give me a reflection from Surah Kahf",
  "Share a reminder about sincerity",
  "Explain a verse about reliance on Allah",
  "Give me a short reminder about dhikr",
  "What does the Quran say about charity",
  "Share a gentle hadith about compassion",
  "Teach me a sunnah I can revive today",
  "Give me a verse that encourages patience",
  "Help me reflect on the hereafter",
  "Share a wisdom from a companion of the Prophet",
  "Teach me something from Surah Yasin",
  "Give me a short reminder about Jannah",
  "Share a hadith about seeking knowledge",
  "Give me a reflection about self discipline",
  "What does the Quran say about repentance",
  "Share a reminder that softens the heart",
  "Help me reflect on staying consistent in worship",
  "Give me a verse that brings comfort",
  "Teach me a simple good deed I can do now",
];

export default function StarterPrompts({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  const pickPrompts = () => {
    return prompts
      .slice(Math.floor(Math.random() * prompts.length - 12))
      .slice(0, 4);
  };

  return (
    <View style={styles.container}>
      {pickPrompts().map((prompt, index) => (
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
