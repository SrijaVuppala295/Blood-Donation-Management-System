"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Countdown } from "@/components/countdown"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DonorEmergency() {
  const [pincode, setPincode] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")

  const query = () => {
    const params = new URLSearchParams()
    if (pincode) params.set("pincode", pincode)
    if (bloodGroup) params.set("bloodGroup", bloodGroup)
    return `/api/requests${params.toString() ? `?${params.toString()}` : ""}`
  }

  const { data, mutate } = useSWR(query, fetcher, { refreshInterval: 8000 })
  const list = useMemo(() => data?.requests || [], [data])

  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  async function volunteer(id: string) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/requests/${id}/volunteer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      mutate()
      alert("You volunteered! The recipient will be notified.")
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || "Failed to volunteer")
    }
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50 border-b">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Emergency <span className="text-red-600">Blood Requests</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Lives are at stake — respond quickly to urgent requests in your area. 
            Filter by pincode or blood group to find the most relevant cases.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border bg-white shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Requests</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                className="h-10 w-full rounded border px-3 focus:ring-2 focus:ring-red-500"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <input
                className="h-10 w-full rounded border px-3 focus:ring-2 focus:ring-red-500"
                placeholder="e.g., O+"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                className="h-10 w-full rounded bg-gray-200 px-3 text-sm hover:bg-gray-300"
                onClick={() => {
                  setPincode("")
                  setBloodGroup("")
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="grid gap-6">
          {list.length === 0 && (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
              <p className="text-sm">🚨 No open emergency requests right now. Check back soon or spread awareness.</p>
            </div>
          )}

          {list.map((r: any) => (
            <div
              key={r.id}
              className="rounded-lg border bg-white p-6 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-red-600">{r.bloodGroup}</h3>
                <p className="text-sm text-gray-600">📍 Pincode: {r.pincode}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Expires in: <Countdown iso={r.expiresAt} />
                </p>
              </div>
              <button
                onClick={() => volunteer(r.id)}
                className="rounded-lg bg-red-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-red-700"
              >
                Volunteer Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
