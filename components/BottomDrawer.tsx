import React from "react";
import { View, Pressable, StyleSheet, Modal } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";

export default function BottomDrawer({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Drawer */}
      <Animated.View
        entering={SlideInUp.duration(250)}
        exiting={SlideOutDown.duration(250)}
        style={styles.drawer}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: "100%",
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    position: "absolute",
    bottom: 0,
  },
});
