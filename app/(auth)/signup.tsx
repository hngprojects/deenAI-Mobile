import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/primaryButton';
import SocialLoginButton from '../../components/socialLoginButton';
import { useSignup } from '../../hooks/useAuth'; // Import the hook
import { SignupFormValues, SocialProvider } from '../../types';
import { SignupSchema } from '../../utils/validation';

export default function SignupScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: signup, isPending: loading } = useSignup();

    const initialValues: SignupFormValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSignup = async (values: SignupFormValues) => {
        try {
            signup(values, {
                onError: (error: any) => {
                    Alert.alert(
                        'Signup Failed',
                        error?.message || 'Signup failed. Please try again.'
                    );
                }
            });


        } catch (err: any) {
            console.error('Signup error:', err);
        }
    };

    const handleSocialLogin = async (provider: SocialProvider) => {
        try {
            router.push('/(onboarding)/location-access');

        } catch (err: any) {
            Alert.alert('Error', err.message || 'Social login failed. Please try again.');
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Create new account" />

            <Text style={styles.description}>
                Start by creating a free account, it helps you save your chats,
                reflections, and progress with ease.
            </Text>

            <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={handleSignup}
                validateOnMount={false}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                    dirty,
                }) => (
                    <View style={styles.formContainer}>
                        <InputField
                            label="Name"
                            placeholder="Enter your name"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={touched.name && errors.name ? errors.name : undefined}
                            autoCapitalize="words"
                            returnKeyType="next"
                        />

                        <InputField
                            label="Email Address"
                            placeholder="Enter your email address"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={touched.email && errors.email ? errors.email : undefined}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            returnKeyType="next"
                        />

                        <InputField
                            label="Create Password"
                            placeholder="Enter your password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={
                                touched.password && errors.password
                                    ? errors.password
                                    : undefined
                            }
                            secureTextEntry={!showPassword}
                            showPasswordToggle
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />

                        <InputField
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={
                                touched.confirmPassword && errors.confirmPassword
                                    ? errors.confirmPassword
                                    : undefined
                            }
                            secureTextEntry={!showConfirmPassword}
                            showPasswordToggle
                            onTogglePassword={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={() => handleSubmit()}
                        />

                        <PrimaryButton
                            title={loading ? "Creating Account..." : "Sign Up"}
                            onPress={() => handleSubmit()}
                            loading={loading}
                            disabled={!isValid || !dirty || loading}
                            style={{ marginTop: 10 }}
                        />
                    </View>
                )}
            </Formik>

            <Text style={styles.divider}>or</Text>

            <SocialLoginButton
                provider="apple"
                onPress={() => handleSocialLogin('apple')}
                // disabled={loading}
            />
            <SocialLoginButton
                provider="google"
                onPress={() => handleSocialLogin('google')}
                // disabled={loading}
            />

            <Text style={styles.termsText}>
                By using Deen AI, you agree to the{' '}
                <Text style={styles.termsLink}>Terms and Privacy Policy.</Text>
            </Text>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        fontFamily: theme.font.regular,
        color: '#27252E',
        lineHeight: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    divider: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: theme.font.regular,
        color: '#999',
        marginVertical: 20,
    },
    termsText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    termsLink: {
        color: theme.color.brand,
        fontWeight: '600',
        fontFamily: theme.font.semiBold,
    },
});