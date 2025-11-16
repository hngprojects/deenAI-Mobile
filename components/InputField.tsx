import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface Props {
  label: string;
  placeholder: string;
  secure?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error?: string; // <-- new prop
}

export default function InputField({ label, placeholder, secure, value, onChangeText, error }: Props) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputWrapper, { borderColor: error ? "red" : "#ddd" }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secure && !show}
        />

        {secure && (
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.icon}>
            {show ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
        </TouchableOpacity>
        )}

      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  icon: {
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
