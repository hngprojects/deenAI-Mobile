import MessageBubble from "@/components/deen-ai/MessageBubble";
import ScreenHeader from "@/components/screenHeader";
import { chatService } from "@/service/chat.service";
import { useChatStore } from "@/store/chat.store";
import { theme } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Book, Loader, Mic, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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
  const { chatId, first } = useLocalSearchParams<{
    chatId: string;
    first: string;
  }>();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const chatListRef = useRef<FlatList<any> | null>(null);

  const {
    addMessage,
    messages,
    setCurrentChatId,
    loadChatMessages,
    updateLastMessage,
  } = useChatStore();

  // try stream immediately this page opens, if error, ignore
  useEffect(() => {
    if (chatId) {
      if (first) {
        handleFirstMessageStream();
      } else {
        loadMessages();
      }
    }

    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
      }
    };
  }, []);

  useEffect(() => {
    // scroll to bottom when messages change
    chatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleFirstMessageStream = async () => {
    try {
      setLoadingMessages(true);
      setCurrentChatId(chatId);

      // Get the last message sent by the user
      const lastUserMessage = messages[messages.length - 1];

      if (!lastUserMessage || lastUserMessage.role !== "user") {
        console.error("No user message found to stream response for.");
        loadMessages();
        return;
      }

      setLoadingMessages(false);
      setStreaming(true);

      // Send message to server
      const messsageRes = await chatService.sendMessageToChatRoom(
        lastUserMessage.content,
        chatId
      );

      // add AI message placeholder
      const aiMessagePlaceholder = {
        chatId: chatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "assistant" as const,
        id: `temp-ai-${Date.now()}`, // Use temp ID since server doesn't return aiMessage yet
        content: "",
      };
      addMessage(aiMessagePlaceholder);

      // Small delay to let the server start processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // stream
      let streamedContent = "";

      streamCleanupRef.current = await chatService.streamChatResponse(
        chatId,
        (chunk: string) => {
          streamedContent += chunk;
          updateLastMessage(streamedContent);
        },
        () => {
          console.log("Stream completed");
          setStreaming(false);
          streamCleanupRef.current = null;
          // reload messages to get final version with citations
          loadMessages();
        },
        (error: string) => {
          console.error("Stream error:", error);
          setStreaming(false);
          streamCleanupRef.current = null;
          // show error to user
          updateLastMessage(`Error: ${error}`);
        }
      );
    } catch (error) {
      console.error("Failed to stream first message", error);
      setLoadingMessages(false);
      setStreaming(false);
    }
  };

  const loadMessages = async (afterStream = false) => {
    try {
      !afterStream && setLoadingMessages(true);
      setCurrentChatId(chatId);
      const response = await chatService.getChatRoomMessages(chatId);
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
    if (loading || streaming) return;
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setPrompt("");

    try {
      setLoading(true);

      // Add user message optimistically
      const userMessage = {
        chatId: chatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user" as const,
        id: `temp-${Date.now()}`,
        content: userPrompt,
      };
      addMessage(userMessage);

      // Send message to backend
      const messageRes = await chatService.sendMessageToChatRoom(
        userPrompt,
        chatId
      );

      // Create placeholder for AI message
      const aiMessagePlaceholder = {
        chatId: chatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "assistant" as const,
        id: `temp-ai-${Date.now()}`, // Use temp ID since server doesn't return aiMessage yet
        content: "",
      };
      addMessage(aiMessagePlaceholder);

      setLoading(false);
      setStreaming(true);

      // Small delay to let the server start processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Start streaming the response
      let streamedContent = "";

      streamCleanupRef.current = await chatService.streamChatResponse(
        chatId,
        // onChunk
        (chunk: string) => {
          streamedContent += chunk;

          // Update the last message (AI response) with accumulated content
          updateLastMessage(streamedContent);
          chatListRef.current?.scrollToEnd({ animated: true });
        },
        // onComplete
        () => {
          console.log("Stream completed");
          setStreaming(false);
          streamCleanupRef.current = null;

          // Optionally reload messages to get the final saved version with citations
          loadMessages(true);
        },
        // onError
        (error: string) => {
          console.error("Stream error:", error);
          setStreaming(false);
          streamCleanupRef.current = null;

          // Show error to user
          updateLastMessage(`Error: ${error}`);
        }
      );
    } catch (error) {
      console.error("Failed to send message", error);
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleHistoryPress = () => router.push("/(deenai)/chat-history");

  const handleBackPress = () => {
    router.dismissAll();
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
            ref={chatListRef}
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
