import MessageBubble from "@/components/deen-ai/MessageBubble";
import ScreenHeader from "@/components/screenHeader";
import { chatService } from "@/service/chat.service";
import { useChatStore } from "@/store/chat.store";
import { theme } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Book, Loader, Mic, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatRoom() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { addMessage, messages, setCurrentChatId, loadChatMessages } =
    useChatStore();

  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoadingMessages(true);
      setCurrentChatId(chatId);
      const response = await chatService.getChatRoomMessages(chatId);
      console.log("Loaded messages for chatId:", chatId, response);
      if (response) {
        loadChatMessages(response.data.reverse() || []);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (loading) return;
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      // Add user message optimistically
      addMessage({
        chatId: chatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        id: "",
        content: prompt,
      });

      const messageRes = await chatService.sendMessageToChatRoom(
        prompt,
        chatId
      );

      if (messageRes?.aiMessage) {
        addMessage(messageRes.aiMessage);
      }

      setPrompt("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryPress = () => router.push("/(deenai)/chat-history");

  const handleBackPress = () => {
    router.replace("/(deenai)/" as any);
  };

  if (loadingMessages) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.color.brand} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <ScreenHeader
          title="DEEN AI"
          titleAlign="center"
          onBackPress={handleBackPress}
          rightComponent={
            <TouchableOpacity onPress={handleHistoryPress}>
              <View style={styles.historyButton}>
                <Book color={theme.color.black} size={24} />
              </View>
            </TouchableOpacity>
          }
        />
      </View>

      {/* Messages */}
      <View style={{ flex: 1 }}>
        {messages.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 20,
            }}
            data={messages}
            keyExtractor={(msg, index) => msg.id || `${msg.createdAt}-${index}`}
            renderItem={(msg) => <MessageBubble message={msg.item} />}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
      </View>

      {/* Input form */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <View style={styles.inputFieldContainer}>
            <TextInput
              style={{ flex: 1, height: "100%" }}
              placeholder="Ask Deen AI"
              value={prompt}
              onChangeText={setPrompt}
            />

            <TouchableOpacity>
              <Mic color={theme.color.gray} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendButtonContainer}
            disabled={loading || !prompt.trim()}
            onPress={handleSend}
          >
            {loading ? (
              <Loader fill={theme.color.primary} color={theme.color.gray} />
            ) : (
              <Send fill={theme.color.primary} color={theme.color.background} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background2,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingBottom: 10,
    backgroundColor: theme.color.background2,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.color.background2,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  inputFieldContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.color.gray,
    paddingHorizontal: 18,
  },
  sendButtonContainer: {
    height: 46,
    width: 46,
    borderRadius: 12,
    backgroundColor: theme.color.brand,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  historyButton: {
    padding: 8,
    borderRadius: "100%",
    backgroundColor: theme.color.gray,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.color.gray,
  },
  emptyText: {
    fontSize: 16,
    color: theme.color.gray,
  },
});
