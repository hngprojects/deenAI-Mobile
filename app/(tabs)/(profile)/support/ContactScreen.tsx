import { theme } from "@/styles/theme";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../../../components/screenHeader";

export default function ContactScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      <ScreenHeader title="Support" />

      {/* Full Name */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      {/* Subject */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />
      </View>

      {/* Message */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          placeholder="Enter your message"
          value={message}
          onChangeText={setMessage}
          style={[styles.input, styles.messageBox]}
          multiline
        />
      </View>

      {/* Send Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.color.brand  }]}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  inputWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },

  messageBox: {
    height: 180,
    textAlignVertical: "top",
  },

  button: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
