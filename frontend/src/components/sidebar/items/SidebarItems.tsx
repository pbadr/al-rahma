import { useEffect, useContext } from "react";

import SidebarItem from "../item/SidebarItem";

import { UserContext } from "@/context/UserContext";
import { UserContextType } from "@/types/chat";

interface SidebarItemsProps {
  toggleSidebar: () => void;
}

export default function SidebarItems({ toggleSidebar }: SidebarItemsProps) {
  const context = useContext(UserContext) as UserContextType;
  const { chatHistory } = context;

  return (
    <>
      {
        chatHistory.length === 0 && <p className="text-sm opacity-80">No history</p>
      }
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