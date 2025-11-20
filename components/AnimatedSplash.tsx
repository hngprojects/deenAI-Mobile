import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function AnimatedSplash() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            {/* Background Image with decorative elements */}
            <Image
                source={require("../assets/images/splashBg.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* Center Content */}
            <Animated.View
                style={[
                    styles.centerContent,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Image
                    source={require("../assets/images/splashImg.png")}
                    style={styles.bulbIcon}
                    resizeMode="contain"
                />
                {/* <Image
                    source={require("@/assets/images/deenai-text.png")}
                    style={styles.logoText}
                    resizeMode="contain"
                /> */}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    centerContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    bulbIcon: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    logoText: {
        width: 120,
        height: 40,
    },
});