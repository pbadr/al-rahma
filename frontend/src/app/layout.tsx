import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Al-Rahma',
  description: 'Al-Rahma is a Quranic assistant that helps you navigate life under the truthful guidance of Quran',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-[#0E1628] to-[#090F1D]`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  )
}
