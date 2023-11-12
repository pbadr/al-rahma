import { Dispatch, SetStateAction } from "react";

export interface UserContextType {
  chatHistory: Chat[];
  getChat: (chatId: string) => Promise<ChatObject[]>;
  deleteChat: (chatId: string) => Promise<string | void>;
  getUserChats: () => void;
}

export interface ChatContextType {
  activeChatId: string;
  setActiveChatId: Dispatch<SetStateAction<string>>;
  activeChatMessages: ChatObject[];
  setActiveChatMessages: Dispatch<SetStateAction<ChatObject[]>>;
}

export interface ChatObject {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  messages: ChatObject[];
}
