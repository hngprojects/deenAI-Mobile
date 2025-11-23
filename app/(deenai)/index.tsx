import MessageBubble from "@/components/deen-ai/MessageBubble";
import StarterPrompts from "@/components/deen-ai/StarterPrompts";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { chatService } from "@/service/deenai.service";
import { useChatStore } from "@/store/chat.store";
import { theme } from "@/styles/theme";
import { Book, Loader, Mic, Send } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function index() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    currentChatId,
    addMessage,
    clearMessages,
    createNewChat,
    messages,
    setCurrentChatId,
  } = useChatStore();

  const handleSend = async () => {
    if (loading) return;
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      if (!currentChatId) {
        const newChatId = await createNewChat(prompt);
        setCurrentChatId(newChatId);

        console.log("newChatId", newChatId);

        addMessage({
          chatId: newChatId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: "user",
          id: "",
          content: prompt,
        });

        const messageRes = await chatService.sendMessageToChatRoom(
          prompt,
          newChatId
        );

        addMessage(messageRes?.aiMessage!);
      } else {
        console.log("CurrentchatID", currentChatId);
        addMessage({
          chatId: currentChatId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: "user",
          id: "",
          content: prompt,
        });
        const messageRes = await chatService.sendMessageToChatRoom(
          prompt,
          currentChatId
        );
        addMessage(messageRes?.aiMessage!);
      }

      setPrompt("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenContainer
        backgroundColor={theme.color.background2}
        scrollable={true}
        showsVerticalScrollIndicator={false}
        paddingHorizontal={0}
        contentContainerStyle={styles.contentContainer}
      >
        {/* <KeyboardAvoidingView behavior="padding"> */}
        <ScreenHeader
          title="DEEN AI"
          titleAlign="center"
          rightComponent={
            <TouchableOpacity>
              <View style={styles.historyButton}>
                <Book color={theme.color.black} size={24} />
              </View>
            </TouchableOpacity>
          }
        />
        {/* Starter prompts */}
        {messages.length === 0 ? (
          <StarterPrompts setMessage={setPrompt} />
        ) : (
          <View style={styles.messagesContainer}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </View>
        )}
        {/* </KeyboardAvoidingView> */}
      </ScreenContainer>

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
