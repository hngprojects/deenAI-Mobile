import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

interface Props {
  label: string;
  linkText: string;
  onPress: () => void;
}

export default function TextLink({ label, linkText, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginTop: 14 },
  label: {
    color: "#ddd",
    fontSize: 16,
  },
  link: {
    color: "#f5d07f",
    fontWeight: "600",
    fontSize: 16,
  },
});
