import MessageBubble from "@/components/deen-ai/MessageBubble";
import StarterPrompts from "@/components/deen-ai/StarterPrompts";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useChatStore } from "@/store/chat.store";
import { theme } from "@/styles/theme";
import { router, useFocusEffect } from "expo-router";
import { Book, Loader, Mic, Send } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DEENAI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    currentChatId,
    addMessage,
    createNewChat,
    messages,
    setCurrentChatId,
    clearMessages,
  } = useChatStore();

  // Clear messages when returning to this screen (new chat page)
  useFocusEffect(
    useCallback(() => {
      clearMessages();
    }, [])
  );

  const handleSend = async () => {
    if (loading) return;
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setPrompt("");

    try {
      setLoading(true);

      // Create new chat
      const newChatId = await createNewChat(prompt);
      setCurrentChatId(newChatId);

      //  add user message optimistically
      addMessage({
        chatId: newChatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        id: `temp-${Date.now()}`,
        content: userPrompt,
      });

      // Navigate to the new chat room
      router.replace(`/(deenai)/${newChatId}?first=true` as any);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.dismissAll();
  };
  const handleHistoryPress = () => router.push("/(deenai)/chat-history");

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background2 }}>
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
          <ScreenContainer
            backgroundColor={theme.color.background2}
            scrollable={true}
            showsVerticalScrollIndicator={false}
            paddingHorizontal={0}
            keyboardAvoiding={true}
          >
            <StarterPrompts setMessage={setPrompt} />
          </ScreenContainer>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 10,
            }}
            data={messages}
            keyExtractor={(msg) => msg.createdAt}
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
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingBottom: 10,
    backgroundColor: theme.color.background2,
  },
  contentContainer: {
    paddingInline: 20,
    flexGrow: 1,
  },
  messagesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingVertical: 20,
    gap: 30,
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
  fixedHeader: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: theme.color.white,
  },
});
