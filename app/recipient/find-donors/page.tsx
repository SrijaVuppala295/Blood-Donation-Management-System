"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"

export default function FindDonorsPage() {
  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  const [bloodGroup, setBloodGroup] = useState("")
  const [pincode, setPincode] = useState("")

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  const url = (() => {
    const params = new URLSearchParams()
    if (bloodGroup) params.set("bloodGroup", bloodGroup)
    if (pincode) params.set("pincode", pincode)
    if (!bloodGroup && !pincode) params.set("all", "true")
    const qs = params.toString()
    return `/api/users/search${qs ? `?${qs}` : ""}`
  })()

  const { data } = useSWR(
    auth?.token ? url : null,
    (u: string) =>
      fetch(u, { headers: { Authorization: `Bearer ${auth?.token || ""}` } }).then((r) => r.json()),
    { keepPreviousData: true, refreshInterval: 15000 }
  )
  const donors = useMemo(() => data?.donors || [], [data])

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Find Donors</h1>
        <p className="mb-6 text-sm text-gray-600">
          All donors are shown by default. Use filters to narrow your search.
        </p>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-3">
          <input
            className="h-12 flex-1 rounded border px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Blood Group (e.g., O+)"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
          <input
            className="h-12 flex-1 rounded border px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button
            className="h-12 rounded bg-gray-200 px-4 text-sm font-medium hover:bg-gray-300 transition"
            onClick={() => {
              setBloodGroup("")
              setPincode("")
            }}
          >
            Clear
          </button>
        </div>

        {/* Donor Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {donors.length === 0 && <p className="text-sm text-gray-600">No donors found.</p>}
          {donors.map((d: any) => (
            <div
              key={d.id}
              className="rounded-lg bg-white p-5 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{d.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Blood Group: <span className="font-medium">{d.bloodGroup}</span> • Pincode:{" "}
                <span className="font-medium">{d.pincode}</span>
              </p>
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{d.email}</span> • Mobile:{" "}
                <span className="font-medium">{d.mobile}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
