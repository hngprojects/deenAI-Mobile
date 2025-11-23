import { theme } from "@/styles/theme";
import { IMessage } from "@/types/chat.type";
import { Copy, Share, ThumbsDown, ThumbsUp } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MessageBubbleProps {
  message: IMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: message.role === "assistant" ? "flex-start" : "flex-end",
        }}
      >
        {/* Message buuble */}
        <View
          style={{
            ...styles.container,
            backgroundColor:
              message.role === "assistant"
                ? theme.color.white
                : theme.color.brand,
            borderTopLeftRadius: message.role === "assistant" ? 0 : 15,
            borderTopRightRadius: message.role === "assistant" ? 15 : 0,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Text
            style={{
              color:
                message.role === "assistant"
                  ? theme.color.black
                  : theme.color.white,
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            {message.content}
          </Text>
        </View>

        {/* Actions - Like, copy, dislike, share */}
        {message.role === "assistant" && (
          <View style={styles.actions}>
            <ThumbsUp size={24} color={theme.color.actionIcon} />
            <ThumbsDown size={24} color={theme.color.actionIcon} />
            <Copy size={24} color={theme.color.actionIcon} />
            <Share size={24} color={theme.color.actionIcon} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxWidth: "80%",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 15,
  },
  hyperlink: {},
});
