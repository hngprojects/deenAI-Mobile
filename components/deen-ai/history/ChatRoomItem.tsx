import { theme } from "@/styles/theme";
import { IChat } from "@/types/chat.type";
import { ArrowRight, History } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

const ChatRoomItem = ({ chat }: { chat: IChat }) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: theme.color.background,
        borderRadius: 24,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <History size={20} />
      <Text
        style={{
          fontSize: 16,
          lineHeight: 30,
          color: theme.color.black,
        }}
      >
        {chat.hasTitle ? chat.title : "Untitled Chat"}
      </Text>

      <ArrowRight size={20} />
    </View>
  );
};
export default ChatRoomItem;
