import Image from "next/image"
import Link from "next/link"

import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center gap-5 bg-secondary rounded-br-3xl h-[50px]">
      <Link href="/">
        <Image
          className="hover:opacity-90 transition-opacity logo"
          src="./logo.svg"
          alt="logo"
          width={50} height={50} />
      </Link>
      <div className="flex">
        <Link href="/chat" className="hover:text-blue-100">Chat</Link>
      </div>
    </nav>
  )
}
