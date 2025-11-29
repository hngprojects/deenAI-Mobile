import {
  ChatMessagesResponse,
  ChatResponse,
  ChatResponseData,
  IChat,
} from "@/types/chat.type";
import { EventSourcePolyfill } from "event-source-polyfill";
import { apiService } from "./api.service";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

class ChatService {
  async getUserChats() {
    try {
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
      const response = await apiService.post<ChatResponse<IChat>>("/chats");

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
        stream: true,
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
      const response = await apiService.get<ChatMessagesResponse>(
        `/chats/${chatRoomId}/messages`
      );

      if (response.success && response.data) {
        return response;
      }

      console.warn("Failed to get chat room messages");
    } catch (error) {
      console.error("Error getting chat room messages", JSON.stringify(error));
    }
  }

  // Stream latest chat response, after a message is sent separately
  async streamChatResponse(
    chatRoomId: string,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: any) => void
  ) {
    const token = await apiService.getAuthToken();
    const url = `${API_BASE_URL}/chats/${chatRoomId}/stream`;

    const stream = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    let isDone = false;
    let hasReceivedData = false;

    stream.onopen = () => {
      console.log("Stream connection opened");
    };

    stream.onmessage = (evt) => {
      try {
        hasReceivedData = true;
        const payload = JSON.parse(evt.data);

        if (payload.done) {
          isDone = true;
          stream.close();
          onComplete && onComplete();
          return;
        }

        if (payload.data) {
          onChunk(payload.data);
        }
      } catch (err) {
        console.error("Error parsing stream message", err);
        if (!isDone) {
          onError && onError(err);
          stream.close();
        }
      }
    };

    stream.onerror = (err: any) => {
      // Only treat as error if:
      // 1. Stream hasn't completed successfully (isDone = false)
      // 2. No data was received (likely a connection error)
      // 3. ReadyState indicates an actual error (0 = connecting, 1 = open, 2 = closed)

      if (!isDone && !hasReceivedData && err?.target?.readyState !== 2) {
        console.error("Stream connection error - failed to connect", err);
        onError && onError("Failed to connect to stream");
        stream.close();
      } else if (!isDone && hasReceivedData) {
        // Connection closed unexpectedly mid-stream (but we got some data)
        console.warn("Stream closed mid-transmission");
        // Consider this a partial success - call onComplete instead of onError
        onComplete && onComplete();
        stream.close();
      } else if (!isDone && err?.target?.readyState === 2) {
        // Stream closed before receiving data - might be too early, not an error
        console.warn("Stream closed without data - possibly too early");
        // Don't call onError, just close silently
        stream.close();
      }
      // If isDone = true, this is expected closing, ignore the error
    };

    return () => {
      if (!isDone) {
        stream.close();
      }
    };
  }
}

export const chatService = new ChatService();
