export interface UserContextType {
  chatHistory: Chat[];
  getChat: (chatId: string) => Promise<Chat[]>;
}

export interface ChatObject {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  messages: ChatObject[];
}
