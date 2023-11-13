"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, MouseEvent } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // User already authenticated
    if (localStorage.getItem('user'))
      router.push('/chat');
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  async function authenticateUser(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    setIsLoading(true);

    const button = event.target as HTMLButtonElement;
    const isMuslim = button.name === 'muslim-yes';

    const response = await fetch(`${process.env.API_ROUTE}/login`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ isMuslim })
    });

    const data = await response.json();
    if (data.message === "Logged in") {
      localStorage.setItem('user', JSON.stringify({
        userId: data.user_id,
        isMuslim: data.is_muslim
      }));
      
      console.log("Saved user id");
      router.push('/chat');
    }

    setIsLoading(false);
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center text-center appear">
      <div className="flex flex-col items-center gap-2 tracking-tighter">
        <h1 className="text-3xl font-bold">Al-Rahma</h1>
        <h1 className="text-3xl font-bold">الرحمة</h1>
        <h2 className="text-lg">Al-Rahma is an intelligent <b>Quranic</b> assistant</h2>
      </div>
      <div className="mt-32 w-64">
        <p className="font-bold">Please choose your preference</p>
          <div className="flex flex-col items-center gap-2 mt-5">
            <label htmlFor="muslim-input">Do you have some existing knowledge of Islam?</label>
            <button onClick={authenticateUser} name="muslim-yes" type="submit" className="button" disabled={isLoading}>Yes</button>
            <button onClick={authenticateUser} name="muslim-no" type="submit" className="button" disabled={isLoading}>No</button>
            <p className="text-xs mt-2 opacity-80">We need this information to give you tailored answers for your questions</p>
          </div>
      </div>
    </main>
  )
}
