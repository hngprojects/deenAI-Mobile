import { theme } from "@/styles/theme";
import { StyleSheet, Text, TouchableOpacity, View, TextStyle } from "react-native";

interface Props {
  label: string;
  linkText: string;
  onPress: () => void;
  labelStyle?: TextStyle;
  linkStyle?: TextStyle;
}

export default function TextLink({ label, linkText, onPress, labelStyle, linkStyle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.link, linkStyle]}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginTop: 14 },
  label: {
    color: theme.color.white,
    fontSize: 16,
    fontFamily: theme.font.light,
  },
  link: {
    color: theme.color.brandLight,
    fontSize: 16,
    fontFamily: theme.font.bold,
  },
});
