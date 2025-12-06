import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SubCard from "./SubCard";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
  badge?: string;
  custom?: boolean;
}

type BillingCycle = "monthly" | "yearly";

const PaymentScreen = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free Plan",
      price: 0,
      currency: "$",
      period: "/month",
      description: "Explore how Deen AI can help get closer to Allah",
      features: [
        { text: "Quran Access", included: true },
        { text: "Essential Daily Tools", included: true },
        { text: "Limited Reflections Access", included: true },
        { text: "Limited AI Chat", included: true },
      ],
      buttonText: "Continue with free plan",
      buttonVariant: "outline",
    },
    {
      id: "premium",
      name: "Premium",
      price: billingCycle === "yearly" ? 99 : 9,
      currency: "$",
      period: billingCycle === "yearly" ? "/year" : "/month",
      description: "Unlock Unlimited Deep Study",
      features: [
        { text: "Unlimited AI Chat", included: true },
        { text: "Full Reflection Suite (Unlimited Access)", included: true },
        { text: "Recitations & Qibla Finder", included: true },
        { text: "Multi-Language Translations", included: true },
      ],
      badge: "Most Popular",
      buttonText: "Upgrade to premium",
      buttonVariant: "primary",
    },
    {
      id: "partnerships",
      name: "Partnerships",
      price: 0,
      currency: "",
      period: "",
      description: "Community & Content Collaboration",
      features: [
        { text: "Target Audience", included: true },
        { text: "Content Distribution", included: true },
        { text: "Community Access", included: true },
        { text: "Revenue Share Model", included: true },
      ],
      buttonText: "Talk to Us",
      buttonVariant: "secondary",
      custom: true,
    },
  ];

  const getToggleButtonStyle = (cycle: BillingCycle) => ({
    ...styles.toggleButton,
    backgroundColor: billingCycle === cycle ? "#fff" : "transparent",
  });

  const getToggleTextStyle = (cycle: BillingCycle) => ({
    ...styles.toggleText,
    fontWeight: (billingCycle === cycle ? "bold" : "normal") as
      | "bold"
      | "normal",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Head text */}
        <Text style={styles.title}>Pro Plan</Text>
        {/* Subheading */}
        <Text style={styles.subtitle}>
          Get more access to our most popular features
        </Text>
      </View>

      {/* Subscriptions */}
      <View>
        {/* Tab [monthly + yearly] */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setBillingCycle("monthly")}
            style={getToggleButtonStyle("monthly")}
          >
            <Text style={getToggleTextStyle("monthly")}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle("yearly")}
            style={getToggleButtonStyle("yearly")}
          >
            <Text style={getToggleTextStyle("yearly")}>Yearly</Text>
            {billingCycle === "yearly" && (
              <Text style={styles.saveBadge}>(Save 7.41%)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Subscription cards */}
        {plans.map((plan) => (
          <SubCard key={plan.id} plan={plan} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 14,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  toggleText: {
    textAlign: "center",
  },
  saveBadge: {
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
});

export default PaymentScreen;
