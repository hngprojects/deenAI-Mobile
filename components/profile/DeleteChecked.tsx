import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// eslint-disable-next-line import/no-unresolved
import Checkbox from "expo-checkbox";
import ScreenHeader from "../screenHeader";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";

export default function DeletecheckScreen() {
  const router = useRouter();

  const [checks, setChecks] = useState<Record<string, boolean>>({
    r1: false,
    r2: false,
    r3: true,
    r4: true,
    r5: false,
    r6: true,
    r7: false,
  });

  const toggleCheck = (key: string) => {
    setChecks({ ...checks, [key]: !checks[key] });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Delete Account" />

      <View style={styles.textWrapper}>
        <Text style={styles.boldText}>We’re sorry to see you go</Text>

        <Text style={styles.normalText}>
          Every journey has its pauses. If you&apos;re thinking of leaving, please tell us why, your feedback
          will help us serve others better, in shā&apos; Allāh. Remember, you can always return whenever your heart
          wishes to reflect again.
        </Text>
      </View>

      <View style={styles.checkboxWrapper}>
        {[
          "I am taking a break from apps",
          "I have privacy or data concern",
          "I found another Quran app I prefer",
          "I faced technical issues on bugs",
          "The app didn't meet my expectations",
          "I no longer use the app regularly",
          "Other [please specify]",
        ].map((label, index) => {
          const key = `r${index + 1}`;
          return (
            <View key={key} style={styles.checkboxRow}>
              <Checkbox
                value={checks[key]}
                onValueChange={() => toggleCheck(key)}
                color={checks[key] ? "#DEA947" : undefined}
                tintColors={{ true: "#DEA947", false: "#000" }}
              />
              <Text style={styles.checkboxLabel}>{label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, styles.keepButton]}
          onPress={() => router.push("/profile")} // or router.back() if going back
        >
          <Text style={styles.keepButtonText}>Keep My Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => router.push("/profile/delete/pausedelete")}
        >
          <Text style={styles.deleteButtonText}>Yes, Delete My Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  textWrapper: { marginTop: 30, marginBottom: 20 },
  boldText: { fontSize: 17, fontWeight: "700", color: "#000", marginBottom: 10 },
  normalText: { fontSize: 14, color: "#555", lineHeight: 20 },

  checkboxWrapper: { marginTop: 10, marginBottom: 30 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  checkboxLabel: { fontSize: 14, color: "#333" },

  buttonWrapper: { flexDirection: "column", gap: 12 },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  keepButton: {
    backgroundColor: "#F2393C",
  },
  keepButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    backgroundColor: theme.color.background,
    borderWidth: 1,
    borderColor: "#000",
  },
  deleteButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
