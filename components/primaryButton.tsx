import { theme } from "@/styles/theme";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[]; 
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
    backgroundColor: theme.color.brand,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 17,
    fontFamily: theme.font.semiBold,
    color: theme.color.white,
  },
  disabledButton: {
    backgroundColor: "#DEC7B0",
    opacity: 0.6,
  },
  disabledText: {
    color: theme.color.white,
  },
});