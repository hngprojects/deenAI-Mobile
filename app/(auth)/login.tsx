import Checkbox from '@/components/Checkbox';
import NetworkToast from '@/components/NetworkToast';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
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
import { useLogin } from '../../hooks/useAuth';
import { LoginFormValues, SocialProvider } from '../../types';
import { LoginSchema } from '../../utils/validation';

export default function LoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { isConnected, showToast, toastType, showNoConnectionToast } = useNetworkStatus();

    const { mutate: login, isPending: loading } = useLogin();

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

const handleLogin = async (values: LoginFormValues) => {
    if (!isConnected) {
        showNoConnectionToast();
        return;
    }

    try {
        login(values, {
            onError: (error: any) => {
                // Check if error is about unverified account
            }
        });

    } catch (err: any) {
        console.error('Login error:', err);
    }
};

    const handleSocialLogin = async (provider: SocialProvider) => {
        if (!isConnected) {
            showNoConnectionToast();
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`${provider} login initiated`);

            router.push('/(tabs)');

        } catch (err: any) {
            Alert.alert('Error', err.message || 'Social login failed. Please try again.');
        }
    };

    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password');
    };

    return (
        <>
            <NetworkToast type={toastType} visible={showToast} />

            <ScreenContainer>
                <ScreenHeader title="Log into account" backRoute="/" />

                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeSubtitle}>Welcome back!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Ready to connect with DeenAI?
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
                        dirty,
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
                                title={loading ? "Logging in..." : "Login"}
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
                    By using Deen Ai, you agree to the{' '}
                    <TouchableOpacity onPress={() => router.push("/(auth)/terms-privacy")}>
                        <Text style={styles.termsLink}>Terms of service and Privacy Policy</Text>
                    </TouchableOpacity>
                </Text>
            </ScreenContainer>
        </>
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
        // marginBottom: 20,
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
        fontFamily: theme.font.bold,
        // color: '#999',
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