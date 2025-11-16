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
    TouchableOpacity,
    View,
} from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/primaryButton';
import SocialLoginButton from '../../components/socialLoginButton';
import { LoginFormValues, SocialProvider } from '../../types';
import { LoginSchema } from '../../utils/validation';
import Checkbox from '@/components/Checkbox';

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    const handleLogin = async (values: LoginFormValues) => {
        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Login values:', values);
            console.log('Remember me:', rememberMe);

            router.push('/(tabs)');

        } catch (err: any) {
            Alert.alert('Error', err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: SocialProvider) => {
        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log(`${provider} login initiated`);

            router.push('/(tabs)');

        } catch (err: any) {
            Alert.alert('Error', err.message || 'Social login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password');
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Log into account" />

            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeSubtitle}>Welcome back!</Text>
                <Text style={styles.welcomeSubtitle}>
                    Ready to connect with NoorAI?
                </Text>
            </View>

            <Formik
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
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
                }) => (
                    <View style={styles.formContainer}>
                        {/* Email Field */}
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
                            label="Password"
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
                            returnKeyType="done"
                            onSubmitEditing={() => handleSubmit()}
                        />

                        <View style={styles.optionsContainer}>
                            <Checkbox
                                label="Remember me"
                                checked={rememberMe}
                                onPress={() => setRememberMe(!rememberMe)}
                            />
                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.forgotPasswordText}>
                                    Forgotten Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title="Login"
                            onPress={() => handleSubmit()}
                            loading={loading}
                            disabled={!isValid || loading}
                            style={{ marginTop: 10 }}
                        />
                    </View>
                )}
            </Formik>

            <Text style={styles.divider}>or</Text>

            <SocialLoginButton
                provider="apple"
                onPress={() => handleSocialLogin('apple')}
            />
            <SocialLoginButton
                provider="google"
                onPress={() => handleSocialLogin('google')}
            />

            <Text style={styles.termsText}>
                By using Deen Ai, you agree to the{' '}
                <Text style={styles.termsLink}>Terms and Privacy Policy.</Text>
            </Text>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        fontFamily: theme.font.regular,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 10,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontFamily: theme.font.semiBold,
        color: theme.color.brand,
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