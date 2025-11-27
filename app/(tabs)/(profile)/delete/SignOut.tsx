import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/styles/theme";

interface ModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignOutConfirmationModal({ visible, setVisible }: ModalProps) {
  const router = useRouter();

  const handleSignOut = () => {
    setVisible(false);
    // your sign-out logic here
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
          <Text style={styles.modalTitle}>Do you want to logout?</Text>

          <Text style={styles.modalText}>
            You would need to log your details in to access your account
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.logOutButton]}
              onPress={handleSignOut}
            >
              <Text style={styles.logOutButtonText}>Log Out</Text>
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
    backgroundColor: '#1a19194d',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    gap: 18,
    marginHorizontal: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 26,
    color: theme.color.black,
    fontFamily: theme.font.semiBold,
  },
  modalText: {
    fontSize: 20,
    fontFamily: theme.font.regular,
    textAlign: 'center',
    lineHeight: 24
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderColor: theme.color.border,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
  logOutButton: {
    backgroundColor: '#E55153',
  },
  logOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
