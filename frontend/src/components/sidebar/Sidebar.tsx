import "./Sidebar.css";

import Image from "next/image";
import SidebarItems from "./items/SidebarItems";
import { useRouter } from "next/navigation";

interface SidebarProps {
  toggled: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ toggled, toggleSidebar }: SidebarProps) {
  const router = useRouter();

  const handleLogOut = async () => {
    const response = await fetch(`${process.env.API_ROUTE}/logout`)
    const data = await response.json();

    localStorage.removeItem('userId');
    console.log(data);

    router.push('/');
  }
  return (
    <aside className={`sidebar ${toggled && 'toggled'} absolute md:relative flex flex-col justify-between w-[260px] bg-[#18233D] p-4`}>
      <div> {/* Top section */}
        <div> {/* Information */}
          <div className="flex items-center gap-3 text-xl font-bold">
            <Image
              className="hover:opacity-90 transition-opacity logo"
              src="/images/logo.svg"
              alt="logo"
              width={50} height={50}
              style={{ width: 40, height: 40 }}
            />
            <h1>Al-Rahma</h1>
          </div>
          <p className="text-sm">Your intelligent <b>Quranic</b> assistant</p>
          <button onClick={() => {
            toggleSidebar();
            router.replace('/chat');
          }} className="button mt-3 !w-full">New Chat</button>
        </div>
        <div className="mt-6"> {/* User Chat History */}
          <h2 className="text-lg font-bold mb-2">User Chat History</h2>
          <div className="flex flex-col gap-5">
            {
              <SidebarItems toggleSidebar={toggleSidebar} />
            }
          </div>
        </div>
      </div>
      <div className="mt-10"> {/* Bottom section */}
        <div className="flex justify-center items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs">This application uses GPT-4</p>
        </div>
          <button onClick={handleLogOut} className="button flex justify-center items-center gap-2 mt-2 !w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Log out
          </button>
      </div>
    </aside>
  )
}
