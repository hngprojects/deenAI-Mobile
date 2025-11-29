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
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/primaryButton';
import SocialLoginButton from '../../components/socialLoginButton';
import { useSignup } from '../../hooks/useAuth';
import { SignupFormValues, SocialProvider } from '../../types';
import { SignupSchema } from '../../utils/validation';

export default function SignupScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: signup, isPending: loading } = useSignup();
    const { showToast } = useToast();
    // const { signInWithGoogle, isLoading: googleLoading } = useGoogleSignIn();
    const { signInWithGoogle, isLoading: googleLoading } = useGoogleOAuth();

    const { isConnected, showToast: showNetworkToast, toastType, showNoConnectionToast } = useNetworkStatus();

    const initialValues: SignupFormValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSignup = (values: SignupFormValues) => {
        if (!isConnected) {
            showNoConnectionToast();
            return;
        }

        signup(values, {
            onError: (error: any) => {
                // Toast is already shown in useSignup hook
                // No need for additional handling here
            }
        });
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

    return (
        <>
            <NetworkToast type={toastType} visible={showNetworkToast} />

            <ScreenContainer>
                <ScreenHeader title="Create new account" />

                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <Text style={styles.description}>
                        Start by creating a free account, it helps you save your chats,
                        reflections, and progress with ease.
                    </Text>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={handleSignup}
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
                                    editable={!loading}
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
                                    editable={!loading}
                                />

                                <InputField
                                    label="Create Password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    error={touched.password && errors.password ? errors.password : undefined}
                                    secureTextEntry={!showPassword}
                                    showPasswordToggle
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    editable={!loading}
                                />

                                <InputField
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                                    secureTextEntry={!showConfirmPassword}
                                    showPasswordToggle
                                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    onSubmitEditing={() => handleSubmit()}
                                    editable={!loading}
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

                    <View style={{ alignItems: "center" }}>
                        <TextLink
                            label="Already have an account?"
                            linkText="Log in"
                            onPress={() => router.push("/(auth)/login")}
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
    formContainer: {
        marginBottom: 20,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontFamily: theme.font.regular,
        color: '#27252E',
        lineHeight: 24,
        marginTop: 24,
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
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    termsLink: {
        color: theme.color.brand,
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
        marginBottom: 60,
    },
    termsContainerText: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
    },
});