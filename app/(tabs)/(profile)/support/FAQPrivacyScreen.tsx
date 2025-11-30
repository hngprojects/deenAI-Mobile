import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenHeader from "@/components/screenHeader";
import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";

export default function FAQPrivacyScreen() {
  const params = useLocalSearchParams();
  const question = params.question as string;

  // Map questions to their answers
  const getAnswerContent = (questionText: string) => {
    const answers: { [key: string]: string[] } = {
      "Is the Deen AI free to use?": [
        ""
      ],
      "Is Deen AI a fatwa-issuing tool?": [
        ""
      ],
      "Is my data private?": [
        ""
      ],
      "What is Deen AI?": [
        "Deen AI is a warm, intelligent, and faith-centered digital companion designed to help Muslims build a peaceful, consistent, and emotionally supportive relationship with the Qur'an."
      ],
      "What sources does Deen AI use?": [
        "It uses the Qur'an and authentic Hadith collections."
      ]
    };

    return answers[questionText] || ["Answer not available."];
  };

  const answerParagraphs = getAnswerContent(question);

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader 
        title="Frequently Asked Questions"  
        onBackPress={() => router.push('/(tabs)/(profile)/support/FAQScreen')}
      />

      <View style={styles.content}>
        <Text style={styles.questionText}>{question}</Text>
        
        {answerParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.answerText}>
            {paragraph}
          </Text>
        ))}
        
        
<TouchableOpacity 
  onPress={() => router.push('/(tabs)/(profile)/support/ContactScreen')}
  style={styles.contactSection}
>
  <Text style={styles.contactTitle}>
    Do you have more questions you would like us to answer?
  </Text>
  
  <Text style={styles.contactLink}>
    Click to Contact Support. We are always available to answer your questions.
  </Text>
</TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { 
    flex: 1, 
    padding: 20 
  },
  questionText: {
    fontSize: 20,
    lineHeight: 28,
    color: theme.color,
    marginBottom: 20,
    fontWeight: "600",
    fontFamily: theme.font.semiBold
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 16,
    fontWeight: "400",
    fontFamily: theme.font.regular
  },
  
  contactSection: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.color.primary
  },
  contactTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
    fontFamily: theme.font.semiBold
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    fontWeight: "400",
    fontFamily: theme.font.regular
  },
  contactLink: {
    fontSize: 14,
    lineHeight: 20,
    color: "#964B00", 
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
    textDecorationLine: 'underline',
    marginHorizontal: 4
  }
});
