import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdhkarCounterProps {
  current: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

export default function AdhkarCounter({
  current,
  total,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}: AdhkarCounterProps) {
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

      {/* Counter Circle */}
      <View style={styles.counterContainer}>
        <View
          style={[
            styles.progressCircle,
            {
              borderColor: current === 0 ? "#E0E0E0" : "#964B00",
            },
          ]}
        >
          <Text style={styles.counterText}>
            {current}/{total}
          </Text>
        </View>
      </View>

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
        <Ionicons name="chevron-forward" size={24} color="#FFF" />
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
    opacity: 0.5,
  },
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});
