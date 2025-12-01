import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark" | "auto";
  scrollable?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  paddingHorizontal?: number;
  keyboardAvoiding?: boolean;
  fixedHeader?: ReactNode;
  fixedFooter?: ReactNode;
  useFixedHeaderLayout?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  fixedHeader,
  fixedFooter,
  backgroundColor = "#ffffff98",
  statusBarStyle = "dark",
  scrollable = true,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  paddingHorizontal = 20,
  keyboardAvoiding = true,
  useFixedHeaderLayout = true,
}) => {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

  const FIXED_HEADER_TOP = statusBarHeight + 10;
  const FIXED_HEADER_HEIGHT = 70;

  const getTopPadding = () => {
    if (!scrollable) {
      return FIXED_HEADER_TOP;
    }
    if (useFixedHeaderLayout && fixedHeader) {
      return FIXED_HEADER_TOP + FIXED_HEADER_HEIGHT;
    }
    return FIXED_HEADER_TOP;
  };

  const content = scrollable ? (
    children
  ) : (
    <View style={styles.contentWrapper}>{children}</View>
  );

  const scrollContent = (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: getTopPadding(),
          paddingHorizontal: paddingHorizontal,
        },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );

  const keyboardAvoidingContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {scrollable ? scrollContent : content}
    </KeyboardAvoidingView>
  ) : scrollable ? (
    scrollContent
  ) : (
    content
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ExpoStatusBar style={statusBarStyle} backgroundColor={backgroundColor} />

      {/* FIXED HEADER */}
      {useFixedHeaderLayout && fixedHeader && (
        <View
          style={[
            styles.fixedHeader,
            {
              paddingTop: FIXED_HEADER_TOP,
              height: FIXED_HEADER_TOP + FIXED_HEADER_HEIGHT,
            },
          ]}
        >
          {fixedHeader}
        </View>
      )}

      {keyboardAvoidingContent}
      {/* FIXED FOOTER */}
      {fixedFooter && <View style={styles.fixedFooter}>{fixedFooter}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  fixedHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  fixedFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ScreenContainer;
