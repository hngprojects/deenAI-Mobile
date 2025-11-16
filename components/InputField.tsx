import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../styles/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  showPasswordToggle,
  onTogglePassword,
  secureTextEntry,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            showPasswordToggle && styles.inputWithIcon,
          ]}
          placeholderTextColor="#999"
          {...props}
          secureTextEntry={secureTextEntry}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={onTogglePassword}
            activeOpacity={0.7}
          >
            {secureTextEntry ? (
              <EyeOff size={20} color="#666" strokeWidth={2} />
            ) : (
              <Eye size={20} color="#666" strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: theme.font.regular,
    marginTop: 4,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
});

export default InputField;