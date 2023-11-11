import { useContext } from "react";

import SidebarItem from "../item/SidebarItem";

import { UserContext } from "@/context/UserContext";

interface SidebarItemsProps {
  toggleSidebar: () => void;
}

export default function SidebarItems({ toggleSidebar }: SidebarItemsProps) {
  const context = useContext(UserContext);
  const { chatHistory } = context;

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