"use client"

import { useState } from "react"
import { Link } from 'react-router-dom'
import { Hotel, Home, Info, Phone } from "lucide-react"

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <Link href="/" className="flex items-center justify-center">
            <Hotel className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">PesanBooking</span>
          </Link>
        </div>

        <div className="w-10">{/* This empty div helps balance the layout */}</div>
      </div>
    </header>
  )
}
