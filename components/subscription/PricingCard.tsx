import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../primaryButton";
import { theme } from "@/styles/theme";

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

   
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>
          {price}
        <Text style={styles.priceDuration}>/ {duration}</Text>
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Includes</Text>

      {features.map((item, idx) => (
        <View key={idx} style={styles.featureRow}>
          <View style={styles.checkboxFilled}>
            <Text style={styles.checkIcon}>✔</Text>
          </View>

          <Text style={styles.textTitle}>{item}</Text>
        </View>
      ))}

  `   <PrimaryButton
          title={buttonText}
          style={{ marginTop: 12, marginBottom: 30 }}
        />`
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#964B00",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
  },

  planTitle: {
    fontSize: 30,
    fontFamily: theme.font.bold,
    color: "#404040",
    marginBottom: 4,
    fontWeight: 500
  },
  planSubtitle: {
    marginBottom: 2,
    fontSize: 17,
    fontFamily: theme.font.regular,
    color: '#404040',
    lineHeight: 24,
  },

  priceText: {
    fontSize: 29,
    fontWeight: "700",
  },
priceBox: {
  borderBottomWidth: 1,
  borderBottomColor: "#bbb7b7ff",
  paddingVertical: 9,
},

  priceDuration: {
    fontFamily: theme.font.regular,
    color: '#404040',
    fontSize: 14
    },

  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    lineHeight: 24,
    color: '#404040',
    marginTop: 23
  },
  listItem: {
    fontSize: 39,
    marginVertical: 3,
  },

  textTitle: {
    fontSize: 17,
    fontFamily: theme.font.regular,
    color: '#404040',
    lineHeight: 24,
  },

featureRow: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 9,
},

checkboxFilled: {
  width: 18,
  height: 18,
  borderWidth: 1.5,
  borderColor: "#964B00",   // your theme color
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

checkIcon: {
  fontSize: 12,
  color: "#964B00", // same color as the border
  fontWeight: "bold",
},


});
