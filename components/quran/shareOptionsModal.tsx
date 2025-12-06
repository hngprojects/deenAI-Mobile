// components/quran/ShareOptionsModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { theme } from "@/styles/theme";

interface ShareOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onShareAsText: () => void;
  onShareAsImage: () => void;
}

export default function ShareOptionsModal({
  visible,
  onClose,
  onShareAsText,
  onShareAsImage,
}: ShareOptionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Options</Text>
          </View>

          <View style={styles.divider} />

          {/* Share as Text Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onShareAsText}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Share as Text</Text>
          </TouchableOpacity>

          {/* Share as Image Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onShareAsImage}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Share as Image</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.color.white,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#9b9b9b",
    marginHorizontal: 24,
  },
  optionButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#9b9b9b",
    borderRadius: 20,
    margin: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: "#0f0f0f",
  },
});
