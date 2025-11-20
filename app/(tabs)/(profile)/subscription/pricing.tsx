import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PricingCard, { PricingCardProps } from "@/components/subscription/PricingCard"
import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";

export default function PricingScreen() {
const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

const pricingData: PricingCardProps[] = [
  {
    title: "Premium",
    subtitle: "Unlock Unlimited Deep Study",
    price: billingCycle === "monthly" ? "$9.99" : "$99.00",
    duration: billingCycle,
    features: [
      "Unlimited AI Chat",
      "Full Reflection Suite",
      "Recitations & Qibla Finder",
      "Multi-Language Translations",
    ],
    buttonText: "Upgrade to premium",
    highlight: true,
  },
  {
    title: "Partnerships",
    subtitle: "Community & Content Collaboration",
    price: "Custom",
    duration: billingCycle,
    features: [
      "Target Audience",
      "Content Distribution",
      "Community Access",
      "Revenue Share Model",
    ],
    buttonText: "Talk to Us",
  },
  {
    title: "Free Plan",
    subtitle: "Explore how Deen AI can help get closer to Allah",
    price: "$0",
    duration: billingCycle,
    features: [
      "Quran Access",
      "Essential Daily Tools",
      "Limited Reflections Access",
      "Limited AI Chatbot",
    ],
    buttonText: "Continue with free plan",
  },
  ];

  return (
    <ScreenContainer>
      <Text style={styles.textHeader}>Pro Plan</Text>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, billingCycle === "monthly" && styles.activeTab]} onPress={() => setBillingCycle("monthly")}>
          <Text style={billingCycle === "monthly" ? styles.activeTabText : styles.inactiveTabText}> Monthly </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, billingCycle === "yearly" && styles.activeTab]} onPress={() => setBillingCycle("yearly")} >
          <Text style={billingCycle === "yearly" ? styles.activeTabText : styles.inactiveTabText}>Yearly (Save 24%)</Text>
        </TouchableOpacity>
      </View>

      {pricingData.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
    textHeader: {
      fontSize: 26,
      fontFamily: theme.font.bold,
      color: '#3C3A35',
      lineHeight: 24,
      marginTop: 24,
      marginBottom: 24
    },
  tabRow: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#eee",
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  activeTabText: {
    fontWeight: "600",
  },
  inactiveTabText: {
    color: "#666",
  },
});
