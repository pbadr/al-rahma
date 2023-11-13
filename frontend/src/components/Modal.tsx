export default function Modal({ isLoading, closeModal, handleLogOut }: { isLoading: boolean, closeModal: () => void, handleLogOut: () => void }) {
  return (
    <div className="fixed inset-0 z-10 h-screen w-screen flex justify-center items-center bg-primary bg-opacity-70 backdrop-blur-lg">
      <div className="appear flex flex-col justify-center items-center bg-secondary px-5 h-72 m-5 rounded-xl text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <h1 className="text-lg font-bold">Are you sure you want to log out?</h1>
        <p className="text-md">Logging out will <b>permanently</b> delete your data</p>
        <div className="flex gap-5 pt-5">
          <button disabled={isLoading} onClick={handleLogOut} className="button !bg-primary !w-[100px] hover:!bg-blue-600">Yes</button>
          <button disabled={isLoading} onClick={closeModal} className="button !bg-primary !w-[100px] hover:!bg-blue-600">No</button>
        </div>
      </div>
    </div>
  )
}
