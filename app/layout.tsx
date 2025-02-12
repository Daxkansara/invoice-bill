import type { Metadata } from "next"
import { League_Spartan } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import type React from "react" // Import React

const leagueSpartan = League_Spartan({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "મનમોહન ઇનવોઇસ",
  description: "મનમોહન ઇનવોઇસ મેનેજમેન્ટ એપ્લિકેશન",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${leagueSpartan.className} flex h-full bg-[#F8F8FB] dark:bg-[#141625]`}>
        <Sidebar />
        <main className="flex-1 px-6 py-8 md:px-12 lg:px-24">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'