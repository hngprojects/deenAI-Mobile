import {
  ChatMessagesResponse,
  ChatResponse,
  ChatResponseData,
  IChat,
} from "@/types/chat.type";
import { apiService } from "./api.service";

class ChatService {
  async getUserChats() {
    try {
      console.log("Getting user chats");
      const response = await apiService.get<ChatResponse<IChat[]>>("/chats");
      if (response.success && response.data) {
        return response.data;
      }
      console.warn("Failed to get user chats");
    } catch (error) {
      console.error("Error getting user chats");
    }
  }

  async createChat() {
    try {
      console.log("Creating ChatRoom");

      const response = await apiService.post<ChatResponse<IChat>>("/chats");

      console.log(`Created ChatRoom ${response.data.id}`);

      if (response.success && response.data) {
        return response.data;
      }

      console.warn("Failed to create Chatroom");
    } catch (error) {
      console.error("Error Creating a Chatroom");
    }
  }

  async sendMessageToChatRoom(message: string, chatRoomId: string) {
    if (!message) throw new Error("Message cannot be empty!");

    if (!chatRoomId) throw new Error("ChatRoom ID is required!");

    const response = await apiService.post<ChatResponse<ChatResponseData>>(
      `/chats/${chatRoomId}`,
      {
        message,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    console.warn("Failed to create Chatroom");
  }

  async getChatRoomMessages(chatRoomId: string) {
    if (!chatRoomId) throw new Error("ChatRoom ID is required!");

    try {
      console.log("Getting chat room messages for", chatRoomId);

      const response = await apiService.get<ChatMessagesResponse>(
        `/chats/${chatRoomId}/messages`
      );

      // console.log("Fetched chat room messages", response);

      if (response.success && response.data) {
        return response;
      }

      console.warn("Failed to get chat room messages");
    } catch (error) {
      console.error("Error getting chat room messages", JSON.stringify(error));
    }
  }
}

export const chatService = new ChatService();
