export interface IChat {
  id: string;
  userId: string;
  title: string;
  hasTitle: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reference {
  type: "quran" | "hadith";
  // For Quran
  surah?: number;
  startAyah?: number;
  endAyah?: number;
  // For Hadith
  collection?: string;
  hadithNumber?: string;
}
export interface IMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
  aiReferences?: Reference[];
}

export interface ChatResponseData {
  userMessage: IMessage;
  aiMessage: IMessage;
  messages?: IMessage[];
}

export interface ChatMessagesResponse {
  success: boolean;
  status: string;
  message: string;
  data: IMessage[];
}

export interface ChatResponse<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
  status_code: number;
}
