import { chatService } from "@/service/chat.service";
import { theme } from "@/styles/theme";
import { IChat } from "@/types/chat.type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChatRoomItem from "../deen-ai/history/ChatRoomItem";

const RecentChats = () => {
  const [recentChats, setRecentChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentChats();
  }, []);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      const res = await chatService.getUserChats();
      if (res && res.length > 0) {
        // Get only the last 5 chats, no date grouping
        const lastFiveChats = res.slice(0, 5);
        setRecentChats(lastFiveChats);
      } else {
        setRecentChats([]);
      }
    } catch (e) {
      console.error("Error fetching recent chats:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/(deenai)/${chatId}` as any);
  };

  const handleViewAllPress = () => {
    router.push("/(deenai)/chat-history");
  };

  const handleRefresh = () => {
    fetchRecentChats();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Chats</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.color.primary} />
        </View>
      </View>
    );
  }

  if (recentChats.length === 0) {
    return null; // Don't show the component if there are no chats
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Chats</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatsContainer}>
        {recentChats.map((chat) => (
          <ChatRoomItem
            key={chat.id}
            chat={chat}
            onBack={() => handleChatPress(chat.id)}
            onDelete={handleRefresh}
            onRename={handleRefresh}
          />
        ))}
      </View>
    </View>
  );
};

const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

export default RecentChats;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.color.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.color.brand,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chatsContainer: {
    gap: 12,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.color.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.color.text,
  },
  chatDate: {
    fontSize: 13,
    color: theme.color.gray,
  },
});
