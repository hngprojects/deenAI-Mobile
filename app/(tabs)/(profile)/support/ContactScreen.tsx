import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput
} from 'react-native';
import { Formik } from 'formik';

import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/primaryButton';
import { ContactSupportType } from '@/types/profile.types';
import { ContactSupportSchema } from '@/utils/validation';
import { useContactSupport } from '@/hooks/useUpdateProfile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { theme } from '@/styles/theme';

const { width } = Dimensions.get('window');

export default function ContactScreen() {
  const { mutate: contactSupport, isPending } = useContactSupport();
  const { isConnected, showNoConnectionToast } = useNetworkStatus();

  const initialValues: ContactSupportType = {
    fullname: "",
    email: "",
    subject: "",
    message: "",
  }

  const handleSave = (values: ContactSupportType) => {
    if (!isConnected) {
      showNoConnectionToast();
      return;
    }

    contactSupport({
      ...values,
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Support" />

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={ContactSupportSchema}
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

            
            <InputField
              label="Subject"
              placeholder="Subject"
              value={values.subject}
              onChangeText={handleChange('subject')}
              onBlur={handleBlur('subject')}
              error={touched.subject ? errors.subject : undefined}
              editable={!isPending}
            />

            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Message</Text>

              <TextInput
                placeholder="Message"
                value={values.message}
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                editable={!isPending}
                style={[
                  styles.input,
                  { height: 120 }, // 👈 increase height
                  touched.message && errors.message ? { borderColor: 'red' } : null
                ]}
                multiline
              />

              {touched.message && errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}
            </View>

            <PrimaryButton
              title={isPending ? 'Sending...' : 'Send Message'}
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
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top", 
  },

  label: {
    fontSize: 16,
    color: theme.color.secondary,
    marginBottom: 6,
    fontFamily: theme.font.semiBold
  },

  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },

});
