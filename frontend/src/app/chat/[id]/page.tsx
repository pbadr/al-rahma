"use client";

import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname();
  console.log(pathName)
  return (
    <p>{pathName}</p>
  )
}
