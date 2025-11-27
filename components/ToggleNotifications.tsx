import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface ToggleProps {
  value: boolean;
  onChange: () => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#C8C8C8", "#964B00"], // Off → On
  });

  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], 
  });

  return (
    <Pressable onPress={onChange}>
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX: thumbTranslate }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: 30,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    backgroundColor: "#FFF",
    borderRadius: 50,
    elevation: 4,
  },
});
