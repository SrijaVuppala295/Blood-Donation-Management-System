"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { User, HeartPulse, Megaphone } from "lucide-react"

const fetcher = (url: string) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}")
  return fetch(url, { headers: { Authorization: `Bearer ${auth.token || ""}` } }).then((r) => r.json())
}

export default function DonorDashboard() {
  const { data } = useSWR("/api/auth/me", fetcher)
  const user = data?.user

  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Profile / Hero Card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm mb-10 flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome{user ? `, ${user.name}` : ""}
            </h1>
            <p className="text-sm text-gray-600">{user?.email || "Your donor account"}</p>
            <p className="mt-2 text-gray-700">
              Points:{" "}
              <span className="font-semibold text-emerald-600">{user?.points ?? 0}</span>
            </p>

            {/* Progress bar for points */}
            <div className="mt-2 h-2 w-48 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min((user?.points ?? 0) / 100 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Progress to next milestone</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="/donor/emergency"
            className="group rounded-xl border bg-white p-6 shadow-sm hover:border-red-600 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-red-600" />
              <h3 className="font-medium text-gray-900 group-hover:text-red-600">
                Emergency Requests
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              See urgent requests in your area and volunteer quickly.
            </p>
          </a>

          <a
            href="/campaigns"
            className="group rounded-xl border bg-white p-6 shadow-sm hover:border-red-600 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-red-600" />
              <h3 className="font-medium text-gray-900 group-hover:text-red-600">
                Campaigns
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Join donation campaigns to earn more points and recognition.
            </p>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
