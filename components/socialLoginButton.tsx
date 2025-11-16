import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";

interface Props {
  icon: any;
  label: string;
  onPress: () => void;
}

export default function SocialButton({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.text}>{label}</Text>
      <View style={{ width: 20 }} /> 
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  iconWrapper: {
    position: "absolute",
    left: 16,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
