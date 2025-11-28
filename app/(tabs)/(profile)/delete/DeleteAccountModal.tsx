import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/styles/theme";

interface ModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteAccountModal({
  visible,
  setVisible,
}: ModalProps) {
  const router = useRouter();

  const handleSignOut = () => {
    setVisible(false);
    router.push("/(tabs)/(profile)/delete/OTPDeleteAccount");
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Did you know?</Text>

          <Text style={styles.modalText}>
            You can pause notifications or sign out temporarily instead of
            deleting your data. You won&apos;t lose your saved reflections or
            chats if you choose to come back later.
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
                router.push("/(tabs)/(profile)/ProfileScreen");
              }}
            >
              <Text style={styles.cancelButtonText}>
                Pause My Account Instead
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.logOutButton]}
              onPress={handleSignOut}
            >
              <Text style={styles.logOutButtonText}>
                Yes, Delete My Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#1a19194d",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    gap: 18,
    marginHorizontal: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 25,
    color: theme.color.black,
    fontFamily: theme.font.semiBold,
  },
  modalText: {
    fontSize: 20,
    fontFamily: theme.font.regular,
    textAlign: "center",
    lineHeight: 24,
  },

  modalButtons: {
    flexDirection: "column",
    gap: 12,
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
    fontFamily: theme.font.regular,
  },
  logOutButton: {
    backgroundColor: "#E55153",
  },
  logOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
