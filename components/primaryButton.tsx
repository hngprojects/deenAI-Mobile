import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean; // fix spelling and make it optional
}

export default function PrimaryButton({ title, onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled} // prevent presses when disabled
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#964B00",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 22
  },
  disabledButton: {
    backgroundColor: "#ccc", // gray when disabled
    shadowOpacity: 0,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  disabledText: {
    color: "#888", // darker gray for text
  },
});
