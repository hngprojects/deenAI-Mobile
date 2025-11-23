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
