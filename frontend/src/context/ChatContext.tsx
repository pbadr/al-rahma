import { ChatContextType, ChatObject } from "@/types/chat";
import { useState, createContext } from "react";

export const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isAssistantGenerating, setIsAssistantGenerating] = useState(false);
  const [activeChatId, setActiveChatId] = useState('');
	const [chatIdUrlParam, setChatIdUrlParam] = useState<string>('');
  const [activeChatMessages, setActiveChatMessages] = useState<ChatObject[]>([]);

  return (
    <ChatContext.Provider value={{
      isAssistantGenerating,
      setIsAssistantGenerating,
      activeChatId,
      setActiveChatId,
      activeChatMessages,
      setActiveChatMessages,
      chatIdUrlParam,
      setChatIdUrlParam,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
