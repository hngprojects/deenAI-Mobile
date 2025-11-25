import ChatRoomItem from "@/components/deen-ai/history/ChatRoomItem";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { chatService } from "@/service/chat.service";
import { theme } from "@/styles/theme";
import { IChat } from "@/types/chat.type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatHistory = () => {
  const [chatRooms, setChatRooms] = useState<IChat[]>([]);
  const [todayChats, setTodayChats] = useState<IChat[]>([]);
  const [yesterdayChats, setYesterdayChats] = useState<IChat[]>([]);
  const [earlierChats, setEarlierChats] = useState<IChat[]>([]);

  const handleBackPress = () => {
    router.replace("/(deenai)/" as any);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await chatService.getUserChats();
        console.log(res);
        if (res && res.length > 0) {
          setChatRooms(res);
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const todayList: IChat[] = [];
          const yesterdayList: IChat[] = [];
          const earlierList: IChat[] = [];

          res.forEach((chat) => {
            const chatDate = new Date(chat.createdAt);
            if (
              chatDate.getDate() === today.getDate() &&
              chatDate.getMonth() === today.getMonth() &&
              chatDate.getFullYear() === today.getFullYear()
            ) {
              todayList.push(chat);
            } else if (
              chatDate.getDate() === yesterday.getDate() &&
              chatDate.getMonth() === yesterday.getMonth() &&
              chatDate.getFullYear() === yesterday.getFullYear()
            ) {
              yesterdayList.push(chat);
            } else {
              earlierList.push(chat);
            }
          });
          setTodayChats(todayList);
          setYesterdayChats(yesterdayList);
          setEarlierChats(earlierList);
        }
      } catch (e) {
        console.error("Error fetching chat history:", e);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <ScreenContainer
      backgroundColor={theme.color.background2}
      scrollable={true}
      showsVerticalScrollIndicator={false}
      paddingHorizontal={0}
      contentContainerStyle={styles.contentContainer}
    >
      <ScreenHeader title="Chat History" onBackPress={handleBackPress} />

      {/* Render chat rooms grouped by date */}
      <View style={styles.container}>
        {/* Today Chats */}
        {todayChats.length > 0 && (
          <View>
            <Text>Today</Text>
            {todayChats.map((chat) => (
              <ChatRoomItem key={chat.id} chat={chat} />
            ))}
          </View>
        )}

        {/* Yesterday Chats */}
        {yesterdayChats.length > 0 && (
          <View>
            <Text>Yesterday</Text>
            {yesterdayChats.map((chat) => (
              <ChatRoomItem key={chat.id} chat={chat} />
            ))}
          </View>
        )}

        {/* Earlier Chats */}
        {earlierChats.length > 0 && (
          <View>
            <Text>Earlier</Text>
            {earlierChats.map((chat) => (
              <ChatRoomItem key={chat.id} chat={chat} />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};

export default ChatHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingInline: 20,
    flexGrow: 1,
  },
});
