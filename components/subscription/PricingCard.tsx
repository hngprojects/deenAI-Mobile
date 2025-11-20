import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  onPress?: () => void;
}

export default function PricingCard({
  title,
  subtitle,
  price,
  duration,
  features,
  buttonText,
  highlight = false,
  onPress,
}: PricingCardProps) {
  return (
    <View style={styles.card}>
      {highlight && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Most Popular</Text>
        </View>
      )}

      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planSubtitle}>{subtitle}</Text>

      <Text style={styles.priceText}>
        {price}
        <Text style={styles.priceDuration}>/{duration}</Text>
      </Text>

      <Text style={styles.sectionTitle}>Includes</Text>

      {features.map((item, idx) => (
        <Text key={idx} style={styles.listItem}>✓ {item}</Text>
      ))}

      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, highlight ? styles.buttonPrimary : styles.buttonSecondary]}
      >
        <Text style={highlight ? styles.buttonPrimaryText : styles.buttonSecondaryText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFB84C",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    color: "#633100",
    fontSize: 12,
    fontWeight: "600",
  },

  planTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  planSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  priceText: {
    fontSize: 28,
    fontWeight: "700",
  },
  priceDuration: {
    fontSize: 14,
    color: "#666",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  listItem: {
    fontSize: 14,
    marginVertical: 3,
  },

  /* Buttons */
  button: {
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#C37B1E",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#f1f1f1",
  },
  buttonSecondaryText: {
    fontWeight: "600",
  },
});
