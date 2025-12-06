import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { Star, X } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../primaryButton";

interface UpgradePlanModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UpgradePlanModal = ({ isVisible, onClose }: UpgradePlanModalProps) => {
  const handleUpgradePress = () => {
    router.push("/(payment)");
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      style={{ flex: 1 }}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            width: "100%",
            maxWidth: 400,
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* header + close */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Star size={20} fill="#FFB731" color="#FFB731" />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: theme.color.brand,
                }}
              >
                Free AI Chat Limit Reached
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <X size={24} />
            </TouchableOpacity>
          </View>

          {/* description */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: theme.color.text,
              lineHeight: 22,
            }}
          >
            You’ve used all your free AI chats. Upgrade to Deen AI Premium for
            unlimited questions and deeper Islamic insights.
          </Text>
          {/* cta */}

          <PrimaryButton title="Upgrade Plan" onPress={handleUpgradePress} />
        </View>
      </View>
    </Modal>
  );
};

export default UpgradePlanModal;
