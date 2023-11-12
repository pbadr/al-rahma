import Image from "next/image"

import "./Navbar.css";

type NavbarProps = {
  sidebarToggled: boolean;
  toggleSidebar: () => void;
}

export default function Navbar({ sidebarToggled, toggleSidebar }: NavbarProps) {
  return (
    <nav className="navbar">
      <div onClick={toggleSidebar} className="hamburger">
        {
          sidebarToggled ? 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          : 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        }
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
  )
}
