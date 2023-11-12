"use client";

import "./layout.css";

import Sidebar from "@/components/sidebar/Sidebar";
import { useEffect, useState } from "react";

import UserProvider from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import ChatProvider from "@/context/ChatContext";
import { useRouter } from "next/navigation";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarToggled, setSidebarToggled] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth > 768)
      return

    setSidebarToggled(toggled => !toggled);
  }

  const handleResize = () => {
    if (window.innerWidth > 768 && sidebarToggled)
      setSidebarToggled(false);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  })

  return (
    <UserProvider>
      <ChatProvider>
        <main className="flex flex-col">
          <Navbar sidebarToggled={sidebarToggled} toggleSidebar={toggleSidebar} />
          <div className="flex">
            <Sidebar toggled={sidebarToggled} toggleSidebar={toggleSidebar} />
            {
              sidebarToggled && (
                <div onClick={() => setSidebarToggled(false)} className="overlay"></div>
              )
            }
            {children}
          </div>
        </main>
      </ChatProvider>
    </UserProvider>
  )
}
