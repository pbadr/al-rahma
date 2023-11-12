import { ChatContextType, ChatObject } from "@/types/chat";
import { useState, createContext } from "react";

export const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeChatId, setActiveChatId] = useState('');
  const [activeChatMessages, setActiveChatMessages] = useState<ChatObject[]>([]);

  return (
    <ChatContext.Provider value={{
      activeChatId,
      setActiveChatId,
      activeChatMessages,
      setActiveChatMessages
    }}>
      {children}
    </ChatContext.Provider>
  )
}
