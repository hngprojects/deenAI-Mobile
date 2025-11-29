import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import { theme } from "@/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
  const [speakerOn, setSpeakerOn] = useState(true);

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
      <ScreenTitle title="Tasbih" />

      <View style={styles.wrapper}>
        <Image
          source={require("@/assets/images/tasbihthree.png")}
          style={styles.tasbihbg}
          resizeMode="contain"
        />

        <View style={styles.digitalCounter}>
          <Text style={styles.counterText}>
            {String(count).padStart(5, "0")}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          style={styles.clickAreaWrapper}
          activeOpacity={0.6}
        >
          <Image
            source={require("@/assets/images/tasbihtwo.png")}
            style={styles.tasbihClick}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => setShowResetModal(true)}>
          <Image
            source={require("@/assets/images/button.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSpeakerOn(!speakerOn)}>
          <Image
            source={
              speakerOn
                ? require("@/assets/images/no-soundButton.png")
                : require("@/assets/images/buttonSjpeaker.png")
            }
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
              You&apos;ve clicked {count} times today. Resetting will clear your
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
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 40,
  },

  tasbihbg: {
    width: 434,
    height: 434,
  },

  digitalCounter: {
    position: "absolute",
    top: 95,
    backgroundColor: theme.color.black,
    opacity: 0.89,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },

  counterText: {
    fontSize: 50,
    fontFamily: theme.font.digital,
    color: theme.color.white,
    textAlign: "center",
  },

  clickAreaWrapper: {
    position: "absolute",
    top: 156,
    alignItems: "center",
    justifyContent: "center",
  },

  tasbihClick: {
    width: 336,
    height: 336,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  iconImage: {
    width: 60,
    height: 60,
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
    lineHeight: 24,
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
