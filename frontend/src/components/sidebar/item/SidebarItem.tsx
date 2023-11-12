import { UserContext } from "@/context/UserContext";
import { UserContextType } from "@/types/chat";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

interface SidebarItemProps {
  id: string;
  firstMessage: string;
  toggleSideBar: () => void;
}

export default function SidebarItem({ id, firstMessage }: SidebarItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={`/chat/${id}`}>
        <div
          title={firstMessage}
          className="relative appear flex items-center gap-2 text-sm rounded-lg bg-primary py-4 px-3 cursor-pointer hover:bg-secondary transition-colors"
        >
        <ChatHistoryIcon />
          <p className="max-w-[176px] whitespace-nowrap overflow-hidden text-ellipsis">{firstMessage}</p>
        </div>
      </Link>
      {hovered && <DeleteChatHistoryIcon chatId={id} />}
    </div>
  )
}

function ChatHistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  )
}

function DeleteChatHistoryIcon({ chatId }: { chatId: string }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { deleteChat } = useContext(UserContext) as UserContextType;

  async function handleDelete() {
    setIsLoading(true);
    await deleteChat(chatId);
    setIsLoading(false);

    router.replace('/chat')
  }

  return (
    <div onClick={handleDelete} className="absolute bg-secondary rounded-lg py-4 px-2 right-0 top-0 cursor-pointer">
      {
        isLoading ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-50 cursor-not-allowed">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
      }
    </div>
  )
}
