import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";

interface ScreenTitleProps {
  title: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;   // <-- Add this
}

export default function ScreenTitle({ 
  title, 
  showBack = true, 
  rightComponent,
  onBackPress
}: ScreenTitleProps) {

  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();  // use custom action
    } else {
      router.back();  // default behavior
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left Side */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.leftIcon}>
          <ArrowLeft color={theme.color.secondary} size={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Right Side */}
      {rightComponent ? rightComponent : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 1,
  },
  leftIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 23,
    textAlign: "center",
    flex: 1,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
});
