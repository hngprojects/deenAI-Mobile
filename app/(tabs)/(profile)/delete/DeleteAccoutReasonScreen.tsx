import ScreenTitle from "@/components/ScreenTitle";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import DeleteAccountModal from "./DeleteAccountModal";
import Checkbox from "expo-checkbox";

interface ReasonItem {
  id: number;
  reason: string;
}

export default function DeleteAccoutReasonScreen() {
  const router = useRouter();
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);

  const [selectedReasons, setSelectedReasons] = useState<number[]>([]);
  const [otherReason, setOtherReason] = useState(""); // NEW STATE

  const toggleReason = (id: number) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const reasonsData: ReasonItem[] = [
    { id: 1, reason: "I’m taking a break from apps" },
    { id: 2, reason: "I have privacy or data concerns" },
    { id: 3, reason: "I found another Quran app I prefer" },
    { id: 4, reason: "I faced technical issues or bugs" },
    { id: 5, reason: "The app didn’t meet my expectations" },
    { id: 6, reason: "I no longer use the app regularly" },
    { id: 7, reason: "Other (please specify)" },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.container}>
        <ScreenTitle
          title="Delete Account"
          onBackPress={() =>
            router.push("/(tabs)/(profile)/DeleteAccountScreen")
          }
        />

        <View style={styles.textWrapper}>
          <Text style={styles.boldText}>We&apos;re sorry to see you go.</Text>

          <Text style={styles.normalText}>
            Every journey has its pauses. If you&apos;re thinking of leaving,
            please tell us why, your feedback will help us serve others better,
            in shā’ Allāh. Remember, you can always return whenever your heart
            wishes to reflect again.
          </Text>

          <Text style={styles.normalText}>
            We&apos;re sad to see you go, but we understand that sometimes
            it&apos;s necessary. Please take a moment to consider the
            consequences before proceeding.
          </Text>
        </View>

        {/* Reasons List */}
        <View>
          {reasonsData.map((reason) => (
            <View key={reason.id} style={styles.featureRow}>
              <Checkbox
                value={selectedReasons.includes(reason.id)}
                onValueChange={() => toggleReason(reason.id)}
                style={styles.checkbox}
                color={
                  selectedReasons.includes(reason.id) ? "#964B00" : undefined
                }
              />
              <Text style={styles.textTitle}>{reason.reason}</Text>
            </View>
          ))}
        </View>

        {/* Show text area if "Other" is selected */}
        {selectedReasons.includes(7) && (
          <View style={styles.otherBox}>
            <Text style={styles.otherLabel}>Please specify:</Text>
            <TextInput
              value={otherReason}
              onChangeText={setOtherReason}
              placeholder="Type your reason..."
              multiline
              style={styles.textArea}
            />
          </View>
        )}

        {/* Buttons */}
        <View style={styles.screenButtons}>
          <TouchableOpacity
            style={[styles.screenButton, styles.cancelButton]}
            onPress={() => router.push("/(tabs)/(profile)/ProfileScreen")}
          >
            <Text style={styles.cancelButtonText}>Keep My Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.screenButton, styles.deleteButton]}
            onPress={() => setDeleteAccountModalVisible(true)}
          >
            <Text style={styles.deleteButtonText}>Yes, Delete My Account</Text>
          </TouchableOpacity>
        </View>

        <DeleteAccountModal
          visible={deleteAccountModalVisible}
          setVisible={setDeleteAccountModalVisible}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  textWrapper: { marginTop: 20, marginBottom: 10 },

  boldText: {
    fontSize: 24,
    color: "#000",
    marginBottom: 10,
    fontFamily: theme.font.semiBold,
  },

  normalText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#555",
    marginBottom: 12,
    fontFamily: theme.font.regular,
  },

  textTitle: {
    fontSize: 17,
    fontFamily: theme.font.regular,
    color: "#404040",
    lineHeight: 24,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 9,
  },

  checkbox: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  /* OTHER TEXTBOX STYLES */
  otherBox: {
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  otherLabel: {
    fontSize: 16,
    color: "#333",
    fontFamily: theme.font.semiBold,
    marginBottom: 6,
  },

  textArea: {
    minHeight: 90,
    maxHeight: 130,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 15,
    fontFamily: theme.font.regular,
    textAlignVertical: "top",
  },

  screenButtons: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
    marginTop: 12,
  },

  screenButton: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    borderColor: theme.color.border,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },

  deleteButton: {
    backgroundColor: "#E55153",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
