import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="p-5 flex items-center gap-5">
      <Link href="/">
        <Image src="./logo.svg" alt="logo" width={80} height={80} />
      </Link>
      <div className="flex">
        <Link href="/chat">Chat</Link>
      </div>
    </nav>
  )
}
