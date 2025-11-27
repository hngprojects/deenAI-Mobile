import ProfileScreen from "@/app/(tabs)/(profile)/ProfileScreen";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { BlurView } from "expo-blur";

const ProfileSignOutOverlay: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen />
      <BlurView intensity={10} style={styles.blurOverlay} tint="light" />

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Do you want to log out?</Text>

          <Text style={styles.cardText}>
            You will need to sign in again{"\n"}to access your account.
          </Text>

          <View style={styles.sideBySideWrapper}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.signOutButton]}
              onPress={() => router.push("/profile/signout")}
            >
              <Text style={styles.signOutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileSignOutOverlay;

const styles = StyleSheet.create({
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cardContainer: {
    position: "absolute",
    top: "30%",
    left: 20,
    right: 20,
    zIndex: 2,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
    textAlign: "center",
  },

  cardText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },

  sideBySideWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#E5E5E5",
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  cancelText: { color: "#000", fontWeight: "700", fontSize: 14 },

  signOutButton: {
    backgroundColor: "#ED0D11",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
