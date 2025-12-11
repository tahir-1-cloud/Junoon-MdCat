"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
  <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-2 h-16 flex justify-between items-center">

    {/* Brand / Logo */}
    <Link href="/" className="inline-block hover:opacity-80 transition">
      <Image
        src="/images/logo/mdlogohome.png"
        alt="JUNOON MDCAT"
        width={75}     // standard clean size
        height={1}
        className="object-contain"
        priority
      />
    </Link>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden text-white text-2xl"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle Menu"
    >
      ☰
    </button>

    {/* Desktop & Mobile Links */}
    <ul
      className={`md:flex md:space-x-8 absolute md:static bg-blue-700 w-full md:w-auto left-0 top-full md:top-auto transition-all duration-300 ease-in-out ${
        menuOpen ? "block" : "hidden"
      }`}
    >
      {["Home", "Courses", "About", "Contact", "Blog"].map((item) => (
        <li key={item} className="border-b md:border-none border-blue-600">
          <Link
            href={
              item.toLowerCase() === "home"
                ? "/"
                : item.toLowerCase() === "courses"
                ? "/courses"
                : item.toLowerCase() === "about"
                ? "/about"
                : item.toLowerCase() === "contact"
                ? "/contact"
                : item.toLowerCase() === "blog"
                ? "/blog"
                : `/${item.toLowerCase()}`
            }
            className="block px-6 py-3 md:p-0 hover:text-yellow-300 font-medium"
          >
            {item}
          </Link>
        </li>
      ))}

      {/* Login Button */}
      <li className="px-6 py-3 md:p-0">
        <Link
          href="/login"
          className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
        >
          Login
        </Link>
      </li>
    </ul>
  </div>
</nav>

  )
}

export default Navbar
