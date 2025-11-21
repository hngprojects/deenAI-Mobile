import { useToast } from '@/hooks/useToast';
import React from 'react';
import Toast from './Toast';

export default function ToastProvider() {
    const { visible, message, type, duration, hideToast } = useToast();

    return (
        <Toast
            visible={visible}
            message={message}
            type={type}
            duration={duration}
            onHide={hideToast}
        />
    );
}