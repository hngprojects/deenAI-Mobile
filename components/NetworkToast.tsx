import { theme } from '@/styles/theme';
import React, { useEffect } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
 
 
interface NetworkToastProps {
    type: 'connected' | 'disconnected';
    visible: boolean;
}
 
// interface NetworkToastProps {
//     isConnected: boolean;
//     visible: boolean;
// }
 
export default function NetworkToast({ type, visible }: NetworkToastProps) {
    const translateY = React.useRef(new Animated.Value(-100)).current;
 
    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
 
            if (type === 'connected') {
                setTimeout(() => {
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }, 3000);
            }
        } else {
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, type, translateY]);
 
    if (!visible) return null;
 
    return (
        <Animated.View
            style={[
                styles.container,
                type ? styles.connected : styles.disconnected,
                { transform: [{ translateY }] },
            ]}
        >
            <View style={styles.content}>
                <Text style={styles.text}>
                    {type ? 'Connection Restored!' : 'Connection lost! Reconnect'}
                </Text>
 
                {type ? (
                    <Image
                        source={require("../assets/images/signal.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                ) : (
                    <Image
                        source={require("../assets/images/alert02.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                )}
            </View>
        </Animated.View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 65,
        left: 50,
        right: 50,
        zIndex: 9999,
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    connected: {
        backgroundColor: '#66B89E',
    },
    disconnected: {
        backgroundColor: '#E86A5A',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    icon: {
        width: 23,
        height: 23,
    },
    text: {
        fontSize: 15,
        fontFamily: theme.font.semiBold,
        color: '#fff',
        flex: 1,
    },
});