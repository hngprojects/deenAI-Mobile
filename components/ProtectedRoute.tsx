import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, isGuest } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                // Redirect to login if authentication is required but user is not authenticated
                router.replace('/(auth)/login');
            } else if (!requireAuth && !isAuthenticated && !isGuest) {
                // Redirect to welcome screen if not authenticated and not guest
                router.replace('/');
            }
        }
    }, [isAuthenticated, isLoading, isGuest, requireAuth]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (!requireAuth && !isAuthenticated && !isGuest) {
        return null;
    }

    return <>{children}</>;
}