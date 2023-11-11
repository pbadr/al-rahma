"use client";

import Image from "next/image";
import "./layout.css";

import Sidebar from "@/components/sidebar/Sidebar";
import { useEffect, useState } from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarToggled, setSidebarToggled] = useState(false);

  function toggleSidebar() {
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
    <main className="flex flex-col">
      <nav className="navbar">
        <div onClick={toggleSidebar} className="hamburger">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
        <div className="logo">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
          />
        </div>
      </nav>
      <div className="flex">
        <Sidebar toggled={sidebarToggled} />
        {
          sidebarToggled && (
            <div onClick={() => setSidebarToggled(false)} className="overlay"></div>
          )
        }
        {children}
      </div>
    </main>
  )
}
