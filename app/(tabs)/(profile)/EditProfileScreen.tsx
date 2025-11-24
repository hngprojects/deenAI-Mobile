import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';

import ScreenContainer from '@/components/ScreenContainer';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/primaryButton';

import { EditProfileType } from '@/types/profile.types';
import { EditProfileSchema } from '@/utils/validation';
import { useEditProfile } from '@/hooks/useUpdateProfile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

import ScreenHeader from '@/components/screenHeader';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const { mutate: editProfile, isPending } = useEditProfile();
  const { isConnected, showNoConnectionToast } = useNetworkStatus();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      // optionally send base64 later
    }
  };

  const initialValues: EditProfileType = {
    fullname: '',
    username: '',
    email: '',
    language: '',
    avatar: avatarUri ?? ''
  };

  const handleSave = (values: EditProfileType) => {
    if (!isConnected) {
      showNoConnectionToast();
      return;
    }

    editProfile({
      ...values,
      avatar: avatarUri ?? ''
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit Profile" />

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('@/assets/images/woman-in-hijab.png')
            }
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.cameraIconWrapper} onPress={pickImage}>
            <Image
              source={require('@/assets/images/camera.png')}
              style={styles.cameraIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        validateOnChange
        validateOnBlur
        onSubmit={handleSave}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty
        }) => (
          <View style={styles.formContainer}>
            <InputField
              label="Full Name"
              placeholder="Enter full name"
              value={values.fullname}
              onChangeText={handleChange('fullname')}
              onBlur={handleBlur('fullname')}
              error={touched.fullname ? errors.fullname : undefined}
              editable={!isPending}
            />

            <InputField
              label="Username"
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              error={touched.username ? errors.username : undefined}
              editable={!isPending}
            />

            <InputField
              label="Email Address"
              placeholder="Email address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email ? errors.email : undefined}
              editable={!isPending}
            />

            <PrimaryButton
              title={isPending ? 'Saving...' : 'Save Changes'}
              onPress={() => handleSubmit()}
              disabled={!isValid || isPending}
              loading={isPending}
              style={{ marginTop: 10 }}
            />
          </View>
        )}
      </Formik>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formContainer: {  
    marginTop: 21,
    marginBottom: 20,
    gap: 6,
  },

  avatarWrapper: { alignItems: 'center', marginTop: 10 },

  avatarContainer: { position: 'relative' },

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
    alignItems: 'center'
  },

  cameraIconImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain'
  }
});
