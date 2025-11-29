import { authService } from '@/service/auth.service';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import PrimaryButton from './primaryButton';

const API_BASE_URL =  process.env.EXPO_PUBLIC_API_BASE_URL;

export default function DebugNetworkTest() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testBasicFetch = async () => {
        setLoading(true);
        setResult('Testing basic fetch...');

        try {
            console.log('🧪 Testing URL:', API_BASE_URL);

            const response = await fetch(API_BASE_URL, {
                method: 'GET',
            });

            const text = await response.text();

            setResult(`✅ Success!\nStatus: ${response.status}\nResponse: ${text.substring(0, 100)}`);
            console.log('✅ Basic fetch works:', response.status);

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setResult(`❌ Failed!\n${errorMsg}`);
            console.error('❌ Basic fetch failed:', error);

            Alert.alert('Network Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const testSignupEndpoint = async () => {
        setLoading(true);
        setResult('Testing signup endpoint...');

        try {
            const url = `${API_BASE_URL}/auth/register`;
            console.log('🧪 Testing signup URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'c',
                    password: 'Qwerty@123',
                }),
            });

            const text = await response.text();

            setResult(`Status: ${response.status}\nResponse: ${text.substring(0, 200)}`);
            console.log('📡 Signup endpoint response:', response.status, text);

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setResult(`❌ Failed!\n${errorMsg}`);
            console.error('❌ Signup test failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const testWithAuthService = async () => {
        setLoading(true);
        setResult('Testing with auth service...');

        try {
            const response = await authService.signup({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Qwerty@123',
                confirmPassword: 'Qwerty@123'
            });

            setResult(`✅ Auth Service Success!\nResponse: ${JSON.stringify(response, null, 2)}`);
            console.log('✅ Auth service signup works:', response);

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setResult(`❌ Auth Service Failed!\n${errorMsg}`);
            console.error('❌ Auth service signup failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Network Debug Tool</Text>
            <Text style={styles.subtitle}>API: {API_BASE_URL}</Text>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Test Basic Connection"
                    onPress={testBasicFetch}
                    loading={loading}
                />

                <PrimaryButton
                    title="Test Signup Endpoint"
                    onPress={testSignupEndpoint}
                    loading={loading}
                    style={{ marginTop: 10 }}
                />

                <PrimaryButton
                    title="Test Auth Service Signup"
                    onPress={testWithAuthService}
                    loading={loading}
                    style={{ marginTop: 10 }}
                />
            </View>

            {result ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{result}</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: theme.color.white,
        borderRadius: 12,
        marginVertical: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        color: '#666',
        marginBottom: 20,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    resultText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        color: theme.color.secondary,
    },
});