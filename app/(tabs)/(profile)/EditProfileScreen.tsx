import InputField from '@/components/InputField';
import PrimaryButton from '@/components/primaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useEditProfile } from '@/hooks/useUpdateProfile';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/store/auth-store';
import { EditProfileType } from '@/types/profile.types';
import { EditProfileSchema } from '@/utils/validation';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);

  const { data: userData } = useUser();
  const { mutate: editProfile, isPending } = useEditProfile();
  const { isConnected, showNoConnectionToast } = useNetworkStatus();
  const { user: authUser } = useAuthStore();

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
      aspect: [1, 1],
      base64: false
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setAvatarUri(selectedImage.uri);

      // ✅ FIX: Extract proper filename and mime type
      const filename = selectedImage.uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      setAvatarFile({
        uri: selectedImage.uri,
        type: type,
        name: filename
      });
    }
  };

  const initialValues: EditProfileType = {
    fullname: authUser?.name || userData?.name || '',
    username: userData?.username || '',
    email: authUser?.email || userData?.email || '',
    language: '',
    avatar: userData?.avatar || ''
  };

  const handleSave = (values: EditProfileType) => {
    if (!isConnected) {
      showNoConnectionToast();
      return;
    }

    // ✅ Only send fields that have changed or avatar if selected
    editProfile({
      username: values.username,
      name: values.fullname,
      avatarFile: avatarFile,
      // Add language if you implement language selection
      // language: values.language
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Edit Profile"
        onBackPress={() => router.back()} // ✅ Use router.back() instead
      />

      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              avatarUri
                ? { uri: avatarUri }
                : userData?.avatar
                  ? { uri: userData.avatar }
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

      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        validateOnChange
        validateOnBlur
        onSubmit={handleSave}
        enableReinitialize
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
              editable={false}
            />

            <PrimaryButton
              title={isPending ? 'Saving...' : 'Save Changes'}
              onPress={() => handleSubmit()}
              disabled={!isValid || isPending || (!dirty && !avatarFile)} // ✅ Enable if avatar changed
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