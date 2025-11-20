import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const NoNotification = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/bell.png")}
        style={styles.icon}
      />

      <Text style={styles.title}>No notifications have appeared!</Text>

      <Text style={styles.subtitle}>
        You’ve yet to receive any notifications. Keep
        {"\n"}
        an eye out for updates, chats, and activity
        {"\n"}
        from your page.
      </Text>
    </View>
  );
};

export default NoNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 25,
    tintColor: "#8A8A8A",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    textAlign: "center",
    lineHeight: 20,
  },
});
