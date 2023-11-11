export interface UserContextType {
  chatHistory: Chat[];
  getChat: (chatId: string) => Promise<ChatObject[]>;
  getUserChats: () => void;
}

export interface ChatObject {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  messages: ChatObject[];
}
