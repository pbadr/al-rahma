import { Chat, UserContextType } from "@/types/chat";
import { useState, useEffect, createContext, ReactNode } from "react";

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    getUserChats();
  }, []);

  const getUserChats = async () => {
    console.log("Fetching user chats...")
    try {
      const response = await fetch(`${process.env.API_ROUTE}/chat-history`, {
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json();
      const userChats = data.chats;
      console.log(userChats);
      setChatHistory(userChats);
      console.log("Done fetching user chats")
    } catch (error) {
      console.error(error);
    }
  }

  const getChat = async (chatId: string) => {
    try {
      const response = await fetch(`${process.env.API_ROUTE}/chat/${chatId}`, {
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json();
      return data.chat;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserContext.Provider value={{ chatHistory, getChat, getUserChats }}>
      {children}
    </UserContext.Provider>
  )
}
