import { theme } from "@/styles/theme";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[]; // Add style prop
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={[styles.text, isDisabled && styles.disabledText]}>
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.color.white,
  },
  text: {
    fontSize: 17,
    fontFamily: theme.font.semiBold,
    color: theme.color.white,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  disabledText: {
    color: theme.color.white,
  },
});