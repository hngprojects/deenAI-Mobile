import { theme } from "@/styles/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
  badge?: string;
  custom?: boolean;
}

interface SubCardProps {
  plan: Plan;
}

export default function SubCard({ plan }: SubCardProps) {
  const handlePlanSelect = () => {
    console.log(`Selected plan: ${plan.id}`);
    // TODO: Implement payment flow
  };

  const getCardStyle = () => ({
    ...styles.card,
    borderColor: plan.badge ? theme.color.brand : "#e0e0e0",
  });

  const getButtonStyle = () => ({
    ...styles.button,
    backgroundColor:
      plan.buttonVariant === "primary"
        ? theme.color.brand
        : plan.buttonVariant === "secondary"
        ? theme.color.text
        : "transparent",
    borderWidth: plan.buttonVariant === "outline" ? 2 : 0,
    borderColor:
      plan.buttonVariant === "outline" ? theme.color.brand : "transparent",
  });

  const getButtonTextStyle = () => ({
    ...styles.buttonText,
    color: plan.buttonVariant === "outline" ? theme.color.brand : "#fff",
  });

  return (
    <View style={getCardStyle()}>
      {/* Badge */}
      {plan.badge && <Text style={styles.badge}>{plan.badge}</Text>}

      {/* Plan Name */}
      <Text style={styles.planName}>{plan.name}</Text>

      {/* Description */}
      <Text style={styles.description}>{plan.description}</Text>

      {/* Price */}
      {plan.custom ? (
        <Text style={styles.price}>
          Custom
          <Text style={styles.period}>/month</Text>
        </Text>
      ) : (
        <Text style={styles.price}>
          {plan.currency}
          {plan.price}
          <Text style={styles.period}>{plan.period}</Text>
        </Text>
      )}

      <View />

      {/* Features Title */}
      <Text style={styles.featuresTitle}>Everything you get in this plan</Text>

      {/* Features List */}
      <View>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View>
              <Image
                source={require("@/assets/check.png")}
                style={styles.checkIcon}
              />
            </View>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity onPress={handlePlanSelect} style={getButtonStyle()}>
        <Text style={getButtonTextStyle()}>{plan.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: theme.color.brand,
    padding: 4,
    borderRadius: 8,
    color: "#fff",
    alignSelf: "flex-start",
  },
  planName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#737373",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  period: {
    fontSize: 16,
    fontWeight: "normal",
  },
  featuresTitle: {
    fontSize: 14,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  checkIcon: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  featureText: {
    fontSize: 16,
    color: theme.color.grayLight,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
