"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import Image from "next/image"
import { Medal, Loader2 } from "lucide-react"

const fetcher = (url: string) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}")
  return fetch(url, { headers: { Authorization: `Bearer ${auth.token || ""}` } }).then((r) => r.json())
}

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR("/api/auth/me", fetcher)
  const user = data?.user

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 mx-auto max-w-3xl px-4 py-12 w-full">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Profile</h1>

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading profile...
          </div>
        )}

        {error && <p className="text-red-600">Failed to load profile. Please try again.</p>}

        {!isLoading && !user && !error && (
          <p className="text-gray-600">Please login to view your profile.</p>
        )}

        {user && (
          <div className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition">
            {/* Top Section */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="h-16 w-16 overflow-hidden rounded-full border shadow-sm">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-red-100 text-red-600 font-bold">
                    {user.name?.[0] || "?"}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {user.role}
                </span>
              </div>

              {/* Points */}
              <div className="rounded-lg bg-emerald-50 px-4 py-2 text-center shadow-sm">
                <div className="text-xs font-medium text-emerald-700">Points</div>
                <div className="text-2xl font-bold text-emerald-800">{user.points}</div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <p className="mb-2 flex items-center gap-2 font-medium text-gray-800">
                <Medal className="h-4 w-4 text-yellow-500" /> Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {(user.badges || []).length === 0 && (
                  <span className="text-sm text-gray-500">No badges yet.</span>
                )}
                {(user.badges || []).map((b: string) => (
                  <span
                    key={b}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 shadow-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
