import Checkbox from '@/components/Checkbox';
import NetworkToast from '@/components/NetworkToast';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
// import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import TextLink from '@/components/textLink';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useToast } from '@/hooks/useToast';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
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
    const { showToast } = useToast();
    const { isConnected, showToast: showNetworkToast, toastType, showNoConnectionToast } = useNetworkStatus();

    const { mutate: login, isPending: loading } = useLogin();
    // const { signInWithGoogle, isLoading: googleLoading } = useGoogleSignIn();
    const { signInWithGoogle, isLoading: googleLoading } = useGoogleOAuth();
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

        if (provider === 'google') {
            await signInWithGoogle();
        } else if (provider === 'apple') {
            showToast('Apple login coming soon!', 'info');
        }
    };


    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password');
    };

    return (
        <>
            <NetworkToast type={toastType} visible={showNetworkToast} />

            <ScreenContainer>
                <ScreenHeader title="Log into account" backRoute="/" />

                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
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

                    <View style={{ alignItems: "center", marginTop: 20 }}>
                        <TextLink
                            label="Don’t have an account?"
                            linkText="Sign up"
                            onPress={() => router.push("/(auth)/signup")}
                            labelStyle={{ color: theme.color.black }}
                            linkStyle={{ color: theme.color.brand }}
                        />
                    </View>

                    <Text style={styles.divider}>or</Text>

                    <SocialLoginButton
                        provider="apple"
                        onPress={() => handleSocialLogin('apple')}
                    />
                    <SocialLoginButton
                        provider="google"
                        onPress={() => handleSocialLogin('google')}
                    />

                    <View style={styles.bottomContainer}>
                        <Text style={styles.termsText}>
                            By using Deen Ai, you agree to the
                        </Text>

                        <View style={styles.termsContainer}>
                            <TouchableOpacity onPress={() => router.push("/(auth)/terms")}>
                                <Text style={styles.termsLink}>Terms of service</Text>
                            </TouchableOpacity>
                            <Text style={styles.termsContainerText}> and </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/privacy")}>
                                <Text style={styles.termsLink}>Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 24
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
    keyboardAvoidingView: {
        flex: 1,
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
        // marginBottom: 40,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    termsContainerText: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
    },
    termsLink: {
        color: theme.color.brand,
        fontWeight: '600',
        fontFamily: theme.font.semiBold,
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: -30,
    },
    bottomContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 80
    }
});