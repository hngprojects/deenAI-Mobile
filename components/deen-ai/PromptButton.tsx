import { theme } from "@/styles/theme";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PromptButtonProps {
  prompt: string;

  setMessage: (message: string) => void;
}

const PromptButton: React.FC<PromptButtonProps> = ({ prompt, setMessage }) => {
  return (
    <TouchableOpacity onPress={() => setMessage(prompt)}>
      <View style={styles.promptButton}>
        <Plus size={16} color={theme.color.black} />
        <Text>{prompt}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default PromptButton;
