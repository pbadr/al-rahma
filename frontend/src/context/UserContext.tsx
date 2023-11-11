import { Chat, ChatContextType } from "@/types/chat";
import { useState, useEffect, createContext, ReactNode } from "react";

export const UserContext = createContext<ChatContextType>({
  chatHistory: []
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    const getUserChats = async () => {
      console.log("Fetching user chats...")
      const response = await fetch(`${process.env.API_ROUTE}/chat-history`, {
        credentials: 'include',
        method: 'GET',
      })

      const data = await response.json();
      const userChats = data.chats;
      console.log(userChats);
      setChatHistory(userChats);
      console.log("Done fetching user chats")
    }

    getUserChats();
  }, []);

  return (
    <UserContext.Provider value={{ chatHistory }}>
      {children}
    </UserContext.Provider>
  )
}
