import { chatService } from "@/service/deenai.service";
import { IMessage } from "@/types/chat.type";
import { create } from "zustand";

interface ChatStore {
  currentChatId: string | null;
  messages: IMessage[];
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: IMessage) => void;
  clearMessages: () => void;
  createNewChat: (firstMessage: string) => Promise<string>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentChatId: null,
  messages: [],
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addMessage: (message: IMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [], currentChatId: null }),
  createNewChat: async (_) => {
    const response = await chatService.createChat();
    return response?.id as string;
  },
}));
