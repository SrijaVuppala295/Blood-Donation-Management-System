"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Countdown } from "@/components/countdown"

const fetcherWithAuth = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())

export default function RecipientRequestsPage() {
  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  const [form, setForm] = useState({ bloodGroup: "", pincode: "", expiresInMins: 120 })

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  const { data, mutate } = useSWR(
    auth?.token ? "/api/requests?mine=1" : null,
    (u) => fetcherWithAuth(u, auth?.token || ""),
    { refreshInterval: 8000 }
  )

  const list = useMemo(() => data?.requests || [], [data])

  async function createRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!auth?.token) return alert("Please login")
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ bloodGroup: "", pincode: "", expiresInMins: 120 })
      mutate()
      alert("Request created and donors notified.")
    } else {
      const d = await res.json()
      alert(d.error || "Failed")
    }
  }

  async function decide(id: string, decision: "accept" | "reject") {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/requests/${id}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ decision }),
    })
    if (res.ok) mutate()
    else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || "Action failed")
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Emergency Requests</h1>

        {/* Create Request Form */}
        <form
          onSubmit={createRequest}
          className="mb-8 grid gap-4 md:grid-cols-4 bg-white p-5 rounded-lg shadow-md"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Blood Group</label>
            <input
              className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="e.g., O+"
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Pincode</label>
            <input
              className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Enter Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Expires In (mins)</label>
            <input
              className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
              type="number"
              min={5}
              max={1440}
              value={form.expiresInMins}
              onChange={(e) => setForm({ ...form, expiresInMins: Number(e.target.value) })}
            />
          </div>

          <button className="h-12 w-full rounded bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Create Request
          </button>
        </form>

        {/* Requests List */}
        <div className="grid gap-5">
          {list.length === 0 && <p className="text-sm text-gray-600">No requests yet.</p>}

          {list.map((r: any) => (
            <div
              key={r.id}
              className="flex flex-col md:flex-row md:justify-between gap-4 p-5 rounded-lg bg-white shadow hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{r.bloodGroup}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Pincode: <span className="font-medium">{r.pincode}</span> • Status:{" "}
                  <span className="font-medium capitalize">{r.status}</span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Expires in: <Countdown iso={r.expiresAt} />
                </p>

                {r.donor && (
                  <div className="mt-2 p-3 rounded border bg-gray-50 text-sm text-gray-700">
                    <p className="font-medium mb-1">Volunteer Details:</p>
                    <p>
                      {r.donor.name} • {r.donor.bloodGroup}
                    </p>
                    <p>
                      {r.donor.mobile} • {r.donor.email} • {r.donor.pincode}
                    </p>
                  </div>
                )}
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2 mt-3 md:mt-0 md:flex-col">
                  <button
                    onClick={() => decide(r.id, "accept")}
                    className="rounded bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => decide(r.id, "reject")}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 font-medium hover:bg-gray-300 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
