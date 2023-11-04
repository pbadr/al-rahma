export default function Home() {
  return (
    <main className="mt-14 flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-2 tracking-tighter">
        <h1 className="text-3xl font-bold">Al-Rahma</h1>
        <h1 className="text-3xl font-bold">الرحمة</h1>
        <h2 className="text-lg">Al-Rahma is an intelligent <b>Quranic</b> assistant</h2>
      </div>
      <div className="mt-32 w-52">
        <p className="font-bold">Please choose your preference</p>
        <form>
          <div className="flex flex-col items-center gap-2 mt-5">
            <label htmlFor="muslim-input">Are you a Muslim?</label>
            <button type="submit" className="button">Yes</button>
            <button type="submit" className="button">No</button>
            <p className="text-xs mt-2 opacity-80">We need this information to give you tailored answers for your questions</p>
          </div>
        </form>
      </div>
    </main>
  )
}
