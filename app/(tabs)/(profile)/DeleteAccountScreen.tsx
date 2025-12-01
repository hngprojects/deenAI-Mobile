import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  // Fixed Header Component
  const fixedHeader = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color={theme.color.secondary} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}> {t("deleteAccount")}</Text>

      <View style={styles.placeholder} />
    </View>
  );

  return (
    <ScreenContainer
      fixedHeader={fixedHeader}
      useFixedHeaderLayout={true}
      paddingHorizontal={20}
      backgroundColor="#ffffff"
    >
      <View style={styles.textWrapper}>
        <Text style={styles.boldText}>
          {t("deleteTitle")}
        </Text>

        <Text style={styles.normalText}>
          {t("warning1")}
        </Text>

        <Text style={styles.normalText}>
          {t("warning2")}
        </Text>
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => router.push("/(tabs)/(profile)/ProfileScreen")}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, styles.deleteButton]}
          onPress={() =>
            router.push("/(tabs)/(profile)/delete/DeleteAccoutReasonScreen")
          }
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  textWrapper: {
    marginTop: 30,
    marginBottom: 40,
  },
  boldText: {
    fontSize: 26,
    color: "#000",
    marginBottom: 10,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
    alignSelf: "center",
  },
  normalText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#555",
    marginBottom: 12,
    fontFamily: theme.font.regular,
    textAlign: "center",
    alignSelf: "center",
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
    marginTop: 12,
  },
  modalButton: {
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
