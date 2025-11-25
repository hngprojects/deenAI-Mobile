export interface IChat {
  id: string;
  userId: string;
  title: string;
  hasTitle: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
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
