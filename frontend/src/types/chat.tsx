import { Dispatch, SetStateAction } from "react";

export interface User {
  userId: string;
  isMuslim: boolean;
}
export interface UserContextType {
  chatHistory: Chat[];
  isMuslim: boolean | null;
  getChat: (chatId: string) => Promise<ChatObject[]>;
  deleteChat: (chatId: string) => Promise<string | void>;
  getUserChats: () => void;
}

export interface ChatContextType {
  activeChatId: string;
  setActiveChatId: Dispatch<SetStateAction<string>>;
  activeChatMessages: ChatObject[];
  setActiveChatMessages: Dispatch<SetStateAction<ChatObject[]>>;
  chatIdUrlParam: string;
  setChatIdUrlParam: Dispatch<SetStateAction<string>>;
}

export interface ChatObject {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  messages: ChatObject[];
}
