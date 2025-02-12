"use client"

import { Moon, Sun } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function Sidebar() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <aside className="flex h-full flex-col justify-between bg-[#373B53] md:fixed md:h-screen md:w-[103px] md:rounded-r-[20px]">
      <div className="relative h-[103px] w-full rounded-r-[20px] flex items-center justify-center bg-gradient-to-b from-[#7C5DFA] to-[#9277FF]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/360_F_452517973_1oypayRk0EhkQRxvhQDSATL0UQ489KWP.jpg-Lsb2DEAbperXymZe9Ays22ZRm91SSW.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/360_F_452517973_1oypayRk0EhkQRxvhQDSATL0UQ489KWP.jpg-Lsb2DEAbperXymZe9Ays22ZRm91SSW.jpeg"
          alt="KD Logo"
          width={40}
          height={40}
          className="relative z-10"
        />
      </div>
      <button onClick={toggleTheme} className="p-8 text-[#858BB2] hover:text-[#DFE3FA] transition-colors">
        {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
    </aside>
  )
}

