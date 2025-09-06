"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

type UserLite = { id: string; name: string; email: string; role: "donor" | "recipient" } | null

export default function Navbar() {
  const [user, setUser] = useState<UserLite>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUser(parsed.user)
      } catch {}
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("auth")
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="BloodConnect logo"
            width={48}
            height={48}
            className="h-12 w-12 md:h-14 md:w-14"
          />
          <span className="text-lg font-bold text-red-600">BloodConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/campaigns" className="text-sm text-gray-700 hover:text-red-600">
            Campaigns
          </Link>
          <Link href="/about" className="text-sm text-gray-700 hover:text-red-600">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-700 hover:text-red-600">
            Contact
          </Link>

          {user ? (
            <>
              {user.role === "donor" ? (
                <>
                  <Link href="/donor" className="text-sm text-gray-700 hover:text-red-600">
                    Donor
                  </Link>
                  <Link href="/donor/emergency" className="text-sm text-gray-700 hover:text-red-600">
                    Emergency
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/recipient/find-donors" className="text-sm text-gray-700 hover:text-red-600">
                    Find Donors
                  </Link>
                  <Link href="/recipient/requests" className="text-sm text-gray-700 hover:text-red-600">
                    Requests
                  </Link>
                </>
              )}
              <Link href="/profile" className="text-sm text-gray-700 hover:text-red-600">
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-red-600">
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-red-600"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <div className="flex flex-col p-4 gap-3">
            <Link href="/campaigns" className="text-sm text-gray-700 hover:text-red-600">
              Campaigns
            </Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-red-600">
              About
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-red-600">
              Contact
            </Link>

            {user ? (
              <>
                {user.role === "donor" ? (
                  <>
                    <Link href="/donor" className="text-sm text-gray-700 hover:text-red-600">
                      Donor
                    </Link>
                    <Link href="/donor/emergency" className="text-sm text-gray-700 hover:text-red-600">
                      Emergency
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/recipient/find-donors" className="text-sm text-gray-700 hover:text-red-600">
                      Find Donors
                    </Link>
                    <Link href="/recipient/requests" className="text-sm text-gray-700 hover:text-red-600">
                      Requests
                    </Link>
                  </>
                )}
                <Link href="/profile" className="text-sm text-gray-700 hover:text-red-600">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 w-fit"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 hover:text-red-600">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded w-fit"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
