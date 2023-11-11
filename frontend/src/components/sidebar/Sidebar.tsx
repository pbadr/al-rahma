import "./Sidebar.css";

import Image from "next/image";
import SidebarItem from "./item/SidebarItem";
import SidebarItems from "./items/SidebarItems";

interface SidebarProps {
  toggled: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ toggled, toggleSidebar }: SidebarProps) {
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
