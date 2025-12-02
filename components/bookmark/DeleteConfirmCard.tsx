import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteConfirmCardProps {
  surahNumber: number;
  verseNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmCard: React.FC<DeleteConfirmCardProps> = ({
  surahNumber,
  verseNumber,
  onConfirm,
  onCancel,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Confirm Delete</Text>

      <Text style={styles.subTitle}>
        Are you sure you want to delete Surah {surahNumber} : {verseNumber}{" "}
        {"\n"} from your bookmark?
      </Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
        <Text style={styles.deleteText}>Confirm Delete</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.white,
    padding: 24,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    position: "absolute",
  },
  title: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    color: theme.color.black,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    marginBottom: 24,
    textAlign: "center",
  },
  deleteBtn: {
    width: "70%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E55153",
    marginBottom: 12,
  },
  deleteText: {
    color: theme.color.white,
    fontSize: 15,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
  },
  cancelBtn: {
    width: "70%",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.color.black,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
    color: theme.color.black,
  },
});

export default DeleteConfirmCard;
