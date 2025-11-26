import { chatService } from "@/service/chat.service";
import { IMessage } from "@/types/chat.type";
import { create } from "zustand";

interface ChatStore {
  currentChatId: string | null;
  messages: IMessage[];
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: IMessage) => void;
  clearMessages: () => void;
  loadChatMessages: (messages: IMessage[]) => void;
  createNewChat: (firstMessage: string) => Promise<string>;
  updateLastMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentChatId: null,
  messages: [],
  updateLastMessage: (content: string) =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, content } : msg
      ),
    })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addMessage: (message: IMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [], currentChatId: null }),
  loadChatMessages: (messages: IMessage[]) => set({ messages }),
  createNewChat: async (_) => {
    const response = await chatService.createChat();
    return response?.id as string;
  },
}));
