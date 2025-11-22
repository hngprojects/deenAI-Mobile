import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/styles/theme';
import ScreenContainer from '../ScreenContainer';
import ScreenHeader from '../screenHeader'; 

const { width } = Dimensions.get('window');

const EditProfileScreen = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit Profile" />

      {/* Avatar Section */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../assets/images/woman-in-hijab.png')} 
            style={styles.avatar} 
          />
          <View style={styles.cameraIconWrapper}>
            <Image 
              source={require('../../assets/images/camera.png')} 
              style={styles.cameraIconImage} 
            />
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          value={fullName} 
          onChangeText={setFullName} 
          style={styles.input} 
          placeholder="Enter full name" 
          placeholderTextColor="#A1A1A1" 
        />

        <Text style={styles.label}>Username</Text>
        <TextInput 
          value={username} 
          onChangeText={setUsername} 
          style={styles.input} 
          placeholder="Enter username" 
          placeholderTextColor="#A1A1A1" 
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          value={email} 
          onChangeText={setEmail} 
          style={styles.input} 
          placeholder="Enter email" 
          autoCapitalize="none" 
          placeholderTextColor="#A1A1A1" 
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, { backgroundColor: theme.color.brand }]} 
        onPress={() => alert('Changes Saved!')}
      >
        <Text style={[styles.saveBtnText, { color: theme.color.white }]}>Save Changes</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  avatarWrapper: { alignItems: 'center', marginTop: 10 },

  avatarContainer: {
    position: 'relative',
  },

  avatar: { 
    width: width * 0.32, 
    height: width * 0.32, 
    borderRadius: (width * 0.32) / 2 
  },

  cameraIconWrapper: {
    position: 'absolute',
    bottom: 2, 
    right: 5, 
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7EEDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  form: { marginTop: 30, paddingHorizontal: 20 },
  label: { fontSize: 14, marginBottom: 6, color: '#6B7280', fontWeight: '500' },
  input: { width: '100%', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, marginBottom: 20, fontSize: 15 },
  saveBtn: { marginTop: 10, paddingVertical: 14, borderRadius: 15, alignItems: 'center', marginHorizontal: 20 },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
});
