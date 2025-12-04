import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ visible, setVisible, onConfirm }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Delete Bookmark?</Text>
          <Text style={styles.message}>
            Are you sure you want to remove this bookmark?
          </Text>

          <View style={styles.buttonColumn}>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={[styles.button, styles.keepBtn]}
            >
              <Text style={styles.keepText}>Keep Bookmark</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, styles.removeBtn]}
            >
              <Text style={styles.removeText}>Remove Bookmark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    marginBottom: 10,
    color: theme.color.secondary,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    marginBottom: 20,
    color: theme.color.secondary,
    textAlign: "center",
  },
  buttonColumn: {
    flexDirection: "column",
    width: "100%",
    gap: 10, // spacing between buttons
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  keepBtn: {
    backgroundColor: "#E55153",
  },
  removeBtn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.color.primary,
  },
  keepText: {
    color: "white",
    fontWeight: "600",
  },
  removeText: {
    color: "black",
    fontWeight: "600",
    borderColor: "black"
  },
});

export default DeleteConfirmModal;
