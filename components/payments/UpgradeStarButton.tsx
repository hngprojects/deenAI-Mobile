import { theme } from "@/styles/theme";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UpgradeStarButton = () => {
  const handleUpgradePress = () => {};

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={handleUpgradePress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Star size={20} fill="#FFB731" color="#FFB731" />
        <Text style={styles.buttonText}>Upgrade</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: theme.color.background4,
    borderRadius: 20,
    width: 128,
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default UpgradeStarButton;
