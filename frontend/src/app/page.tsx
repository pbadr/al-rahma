"use client";

import { MouseEvent } from "react";

export default function Home() {
  async function authenticateUser(event: MouseEvent<HTMLElement>) {
    event.preventDefault();

    const button = event.target as HTMLButtonElement;
    const isMuslim = button.name === 'muslim-yes';

    const response = await fetch(`${process.env.API_ROUTE}/login`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ isMuslim })
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <main className="mt-14 flex flex-col items-center justify-center text-center appear">
      <div className="flex flex-col items-center gap-2 tracking-tighter">
        <h1 className="text-3xl font-bold">Al-Rahma</h1>
        <h1 className="text-3xl font-bold">الرحمة</h1>
        <h2 className="text-lg">Al-Rahma is an intelligent <b>Quranic</b> assistant</h2>
      </div>
      <div className="mt-32 w-64">
        <p className="font-bold">Please choose your preference</p>
          <div className="flex flex-col items-center gap-2 mt-5">
            <label htmlFor="muslim-input">Do you have some existing knowledge of Islam?</label>
            <button onClick={authenticateUser} name="muslim-yes" type="submit" className="button">Yes</button>
            <button onClick={authenticateUser} name="muslim-no" type="submit" className="button">No</button>
            <p className="text-xs mt-2 opacity-80">We need this information to give you tailored answers for your questions</p>
          </div>
      </div>
    </main>
  )
}
