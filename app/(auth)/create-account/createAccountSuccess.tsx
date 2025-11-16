import React, { useEffect } from "react";
import {Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import PrimaryButton from "@/components/primaryButton";
import { ArrowLeft } from "lucide-react-native";

export default function CreateAccountSuccess() {
  const router = useRouter();

    useEffect(() => {
    // Navigate to location access screen after 2 seconds
    const timer = setTimeout(() => {
      router.push("/access-screens/LocationAccess");
    }, 2000);

    return () => clearTimeout(timer); // clean up if component unmounts early
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={24}/>
      </TouchableOpacity>

      {/* Success Illustration */}
      <Image
        source={require("@/assets/images/success-check.png")} 
        contentFit="contain"
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Account Created Successfully</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        You can now proceed to login and continue your experience with NoorAI.
      </Text>

      {/* Login Button */}
      <PrimaryButton
        title="Login"
        onPress={() => router.push("/login/Login")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  backBtn: {
    width: "100%",
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 30,
    color: "#222",
  },

  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
    marginTop: 56
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
});
