import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center gap-5 bg-secondary rounded-b-lg">
      <Link href="/">
        <Image
          className="hover:opacity-90 transition-opacity"
          src="./logo.svg"
          alt="logo"
          width={80} height={80} />
      </Link>
      <div className="flex">
        <Link href="/chat" className="hover:text-blue-100">Chat</Link>
      </div>
    </nav>
  )
}
