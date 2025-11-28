import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface AdhkarCounterProps {
  current: number;
  total: number;
  onIncrement: () => void;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

export default function AdhkarCounter({
  current,
  total,
  onIncrement,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}: AdhkarCounterProps) {
  const isCompleted = current >= total;

  const progress = total > 0 ? (current / total) : 0;

  const size = 70;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.previousButton,
          disablePrevious && styles.disabledButton,
        ]}
        onPress={onPrevious}
        disabled={disablePrevious}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={disablePrevious ? "#ccc" : "#666"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.counterContainer}
        onPress={onIncrement}
        disabled={isCompleted}
        activeOpacity={0.7}
      >
        <View style={styles.progressWrapper}>
          <Svg width={size} height={size} style={styles.svg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
              fill="white"
            />

            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#964B00"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>

          {/* Counter Text */}
          <View style={styles.counterTextContainer}>
            <Text style={styles.counterText}>
              {current}/{total}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.nextButton,
          disableNext && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={disableNext}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={disableNext ? "#ccc" : "#FFF"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    height: 50,
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  previousButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  nextButton: {
    backgroundColor: "#964B00",
  },
  disabledButton: {
    opacity: 0.4,
  },
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  counterTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});