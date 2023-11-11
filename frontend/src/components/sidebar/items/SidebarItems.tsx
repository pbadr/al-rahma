import { useState, useEffect } from "react";

import SidebarItem from "../item/SidebarItem";

interface SidebarItemsProps {
  toggleSidebar: () => void;
}

interface ChatObject {
  role: string;
  content: string;
}

interface Chat {
  id: string;
  messages: ChatObject[];
}

export default function SidebarItems({ toggleSidebar }: SidebarItemsProps) {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  
  useEffect(() => {
    const getUserChats = async () => {
      const response = await fetch(`${process.env.API_ROUTE}/chat-history`, {
        credentials: 'include',
        method: 'GET',
      })

      const data = await response.json();
      const userChats = data.chats;
      console.log(userChats);
      setChatHistory(userChats);
    }

    getUserChats();
  }, []);

  return (
    <>
      {
        chatHistory.map((chat) => (
          <SidebarItem
            key={chat.id}
            id={chat.id}
            toggleSideBar={toggleSidebar}
            firstMessage={chat.messages[0].content}
          />
        ))
      }
    </>
  )
}