import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import * as Device from "expo-device";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    children: ReactNode;
    fallbackComponent?: (error: Error, resetError: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Comprehensive error logging
        console.error("═══════════════════════════════════════════");
        console.error("🔴 ERROR BOUNDARY CAUGHT AN ERROR");
        console.error("═══════════════════════════════════════════");
        console.error("Error:", error);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Component Stack:", errorInfo.componentStack);
        console.error("═══════════════════════════════════════════");

        // Collect device information for debugging
        try {
            const deviceInfo = {
                platform: Platform.OS,
                platformVersion: Platform.Version,
                deviceName: Device.deviceName,
                deviceModel: Device.modelName,
                osName: Device.osName,
                osVersion: Device.osVersion,
                appVersion: Application.nativeApplicationVersion,
                buildVersion: Application.nativeBuildVersion,
                isDevelopment: __DEV__,
            };

            console.error("📱 Device Info:", JSON.stringify(deviceInfo, null, 2));
        } catch (deviceError) {
            console.error("Failed to collect device info:", deviceError);
        }

        // Update state with error details
        this.setState({
            error,
            errorInfo,
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            try {
                this.props.onError(error, errorInfo);
            } catch (handlerError) {
                console.error("Error in custom error handler:", handlerError);
            }
        }

        // TODO: Send to crash reporting service in production
        // Example integrations:
        /*
        if (!__DEV__) {
          // Sentry
          // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });

          // Firebase Crashlytics
          // crashlytics().recordError(error);
          // crashlytics().log(`Component Stack: ${errorInfo.componentStack}`);
        }
        */
    }

    resetError = () => {
        console.log("🔄 Resetting error boundary...");
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallbackComponent) {
                return this.props.fallbackComponent(
                    this.state.error!,
                    this.resetError
                );
            }

            // Default fallback UI
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={64}
                            color={theme.color.brand}
                            style={styles.icon}
                        />

                        <Text style={styles.title}>Oops! Something went wrong</Text>

                        <Text style={styles.message}>
                            The app encountered an unexpected error. Don&apos;t worry, your data is safe.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>🔍 Debug Info (Dev Only):</Text>

                                <View style={styles.errorSection}>
                                    <Text style={styles.errorLabel}>Error Type:</Text>
                                    <Text style={styles.errorText}>
                                        {this.state.error.name || "Unknown Error"}
                                    </Text>
                                </View>

                                <View style={styles.errorSection}>
                                    <Text style={styles.errorLabel}>Message:</Text>
                                    <Text style={styles.errorText}>
                                        {this.state.error.message || "No message"}
                                    </Text>
                                </View>

                                {this.state.error.stack && (
                                    <View style={styles.errorSection}>
                                        <Text style={styles.errorLabel}>Stack Trace:</Text>
                                        <Text style={styles.errorStack} numberOfLines={10}>
                                            {this.state.error.stack}
                                        </Text>
                                    </View>
                                )}

                                {this.state.errorInfo?.componentStack && (
                                    <View style={styles.errorSection}>
                                        <Text style={styles.errorLabel}>Component Stack:</Text>
                                        <Text style={styles.errorStack} numberOfLines={8}>
                                            {this.state.errorInfo.componentStack}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.resetError}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>

                        {!__DEV__ && (
                            <Text style={styles.footerText}>
                                If this problem persists, please contact support
                            </Text>
                        )}
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        maxWidth: 400,
        width: "100%",
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.color.text,
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: theme.color.gray,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    errorDetails: {
        backgroundColor: "rgba(255, 0, 0, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 0, 0, 0.2)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        width: "100%",
        maxHeight: 400,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.color.text,
        marginBottom: 16,
    },
    errorSection: {
        marginBottom: 12,
    },
    errorLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.color.text,
        marginBottom: 4,
    },
    errorText: {
        fontSize: 12,
        color: "#ff4444",
        fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: 8,
        borderRadius: 4,
    },
    errorStack: {
        fontSize: 10,
        color: "#cc3333",
        fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: 8,
        borderRadius: 4,
        lineHeight: 14,
    },
    button: {
        backgroundColor: theme.color.brand,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footerText: {
        fontSize: 12,
        color: theme.color.gray,
        textAlign: "center",
        fontStyle: "italic",
    },
});

export default ErrorBoundary;