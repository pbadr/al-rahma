import { Chat, UserContextType } from "@/types/chat";
import { delay } from "@/utils/test";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, ReactNode } from "react";

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('userId'))
      return router.replace('/');
    
    getUserChats(); 
  }, [router]);

  const getUserChats = async () => {
    console.log("Fetching user chats...")
    try {
      const response = await fetch(`${process.env.API_ROUTE}/chat-history`, {
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json();
      const userChats: Chat[] = data.chats;

      setChatHistory(userChats.reverse());
      console.log("Done fetching user chats")
    } catch (error) {
      console.error(error);
    }
  }

  const getChat = async (chatId: string) => {
    const response = await fetch(`${process.env.API_ROUTE}/chat/${chatId}`, {
      credentials: 'include',
      method: 'GET',
    })
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    return data.chat;
  }

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`${process.env.API_ROUTE}/chat/${chatId}`, {
        credentials: 'include',
        method: 'DELETE',
      });
      const data = await response.json();
      
      // Reload chat history on sidebar
      getUserChats();

      return data["chat_id"];
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserContext.Provider value={{ chatHistory, getChat, deleteChat, getUserChats }}>
      {children}
    </UserContext.Provider>
  )
}
