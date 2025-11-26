import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter();

  const STORAGE_KEY = "@tasbih_count";

  // Load saved count from AsyncStorage on mount
  useEffect(() => {
    const loadCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCount !== null) setCount(Number(savedCount));
      } catch (e) {
        console.log("Failed to load count from storage:", e);
      }
    };
    loadCount();
  }, []);

  // Save count to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCount = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, count.toString());
      } catch (e) {
        console.log("Failed to save count to storage:", e);
      }
    };
    saveCount();
  }, [count]);

  const handleIncrement = () => setCount(count + 1);

  const handleReset = async () => {
    setCount(0);
    setShowResetModal(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, "0");
    } catch (e) {
      console.log("Failed to reset count in storage:", e);
    }
  };

  return (
    <ScreenContainer backgroundColor={theme.color.white}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.leftIcon}>
          <ArrowLeft color={theme.color.secondary} size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tasbih</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <Text style={styles.counterText}>{count}</Text>

      <TouchableOpacity onPress={handleIncrement}>
        <View style={styles.deviceWrapper}>
          <Image
            source={require("@/assets/images/tasbihone.png")}
            style={styles.deviceImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => setShowResetModal(true)}>
          <Image
            source={require("@/assets/images/button.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("@/assets/images/buttonSjpeaker.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RESET MODAL */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalImage}>
              <Image
                source={require("@/assets/images/arrow.counterclockwise.png")}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.modalTitle}>Are you sure to Reset?</Text>
            <Text style={styles.modalDesc}>
              You&quot;ve clicked {count} times today. Resetting will clear your
              dhikr count.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleReset}>
                <Text style={styles.confirmText}>Yes, Clear Dhikr</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  leftIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  deviceImage: {
    width: 350,
    height: 450,
    resizeMode: "contain",
  },
  iconImage: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 29,
    textAlign: "center",
    flex: 1,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24, // space from top
    marginHorizontal: 16, // optional: left/right padding
  },
  rightPlaceholder: {
    width: 24,
    height: 24,
  },
  counterText: {
    fontSize: 48,
    marginTop: 46,
    fontFamily: theme.font.bold,
    textAlign: "center",
    color: "#404040",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 18,
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 40,
  },

  tapButton: {
    backgroundColor: "#e2e2e2",
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 30,
  },

  tapText: {
    fontSize: 20,
    fontFamily: theme.font.regular,
    color: "#404040",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 35,
    paddingVertical: 40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    alignItems: "center",
  },

  modalImage: {
    alignSelf: "center",
    marginTop: 9,
    marginBottom: 9,
  },

  modalDesc: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 12,
    color: "#555",
    fontSize: 19,
    fontFamily: theme.font.regular,
    lineHeight: 24, // increased for readability
  },

  modalTitle: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 10,
    fontFamily: theme.font.bold,
  },

  modalButtons: {
    marginTop: 20,
    width: "100%", // make buttons span full width if needed
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: theme.color.brand,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  confirmText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: theme.font.regular,
  },

  cancelBtn: {
    marginTop: 10,
    paddingVertical: 13,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c4bcbcff",
    borderRadius: 13,
  },

  cancelText: {
    fontSize: 16,
    color: "#404040",
    fontFamily: theme.font.regular,
  },
});
