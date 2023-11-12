"use client";

import "./layout.css";

import Sidebar from "@/components/sidebar/Sidebar";
import { useEffect, useState } from "react";

import UserProvider from "@/context/UserContext";
import Navbar from "@/components/Navbar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  console.log("Chat Layout rerendered")
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
    </UserProvider>
  )
}
