import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef, useState } from 'react';

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'connected' | 'disconnected'>('connected');
    const previousState = useRef<boolean | null>(null);
    const hideToastTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = state.isConnected && state.isInternetReachable;

            if (previousState.current === false && connected === true) {
                if (hideToastTimeout.current) {
                    clearTimeout(hideToastTimeout.current);
                }

                setToastType('connected');
                setShowToast(true);
                hideToastTimeout.current = setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }

            setIsConnected(connected);
            previousState.current = connected;
        });

        return () => {
            unsubscribe();
            if (hideToastTimeout.current) {
                clearTimeout(hideToastTimeout.current);
            }
        };
    }, []);

    const showNoConnectionToast = () => {
        if (hideToastTimeout.current) {
            clearTimeout(hideToastTimeout.current);
        }

        setToastType('disconnected');
        setShowToast(true);

        hideToastTimeout.current = setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return {
        isConnected,
        showToast,
        toastType,
        showNoConnectionToast,
        hideToast: () => {
            setShowToast(false);
            if (hideToastTimeout.current) {
                clearTimeout(hideToastTimeout.current);
            }
        },
    };
};