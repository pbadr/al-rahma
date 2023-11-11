import "./Sidebar.css";

import Image from "next/image";

interface SidebarProps {
  toggled: boolean;
}

export default function Sidebar({ toggled }: SidebarProps) {
  return (
    <aside className={`sidebar ${toggled && 'toggled'} absolute md:relative flex flex-col justify-between w-[260px] bg-[#18233D] p-4`}>
      <div> {/* Top section */}
        <div> {/* Information */}
          <div className="flex items-center gap-3 text-xl font-bold">
            <Image
              className="hover:opacity-90 transition-opacity logo"
              src="./logo.svg"
              alt="logo"
              width={50} height={50}
            />
            <h1>Al-Rahma</h1>
          </div>
          <p className="text-sm">Your intelligent <b>Quranic</b> assistant</p>
        </div>
        <div className="mt-6"> {/* User Chat History */}
          <h2 className="text-lg font-bold mb-2">User Chat History</h2>
          <p className="mb-3 text-sm text-blue-300">Today</p>
          <div className="flex flex-col gap-5">
            <div className="chat-history-box">
              <ChatHistoryIcon />
              <p>What is the meaning of life?</p>
            </div>
            <div className="chat-history-box">
              <ChatHistoryIcon />
              <p>Can you give Surah for health?</p>
            </div>
            <div className="chat-history-box">
              <ChatHistoryIcon />
              <p>I feel lost. What do I do..</p>
            </div>
            <div className="chat-history-box">
              <ChatHistoryIcon />
              <p>What are some teachings of Prophet Muhammad?</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10"> {/* Bottom section */}
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs">This application uses GPT-4</p>
        </div>
      </div>
    </aside>
  )
}

function ChatHistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  )
}