import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PricingCard, { PricingCardProps } from "@/components/subscription/PricingCard"
import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";

export default function TasbihScreen() {
const [billingCycle, setBillingCycle] = useState<"month" | "yearly">("month");

const pricingData: PricingCardProps[] = [
  {
    title: "Premium",
    subtitle: "Unlock Unlimited Deep Study",
    price: billingCycle === "month" ? "$99" : "$1,100",
    duration: billingCycle,
    features: [
      "Unlimited AI Chat",
      "Full Reflection Suite (Unlimited Access)",
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Pro Plan</Text>
        <Text style={styles.headerSubtitle}>
          Get more access to our most popular features
        </Text>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, billingCycle === "month" && styles.activeTab]} onPress={() => setBillingCycle("month")}>
          <Text style={billingCycle === "month" ? styles.activeTabText : styles.inactiveTabText}> Monthly </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, billingCycle === "yearly" && styles.activeTab]} onPress={() => setBillingCycle("yearly")} >
          <Text style={billingCycle === "yearly" ? styles.activeTabText : styles.inactiveTabText}>Yearly (Save 7.41%)</Text>
        </TouchableOpacity>
      </View>

      {pricingData.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 33,
    fontFamily: theme.font.bold,
    color: "#404040",
    marginBottom: 4,
    fontWeight: 500
  },
  headerSubtitle: {
    fontSize: 17,
    fontFamily: theme.font.regular,
    color: "#404040",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: "85%",  // keeps text nicely centered and readable
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
    fontFamily: theme.font.regular,
    fontSize: 19,
    color: "#404040",
    fontWeight: 700
  },
  inactiveTabText: {
    fontFamily: theme.font.regular,
    fontSize: 19,
    color: "#404040",
  },
});
