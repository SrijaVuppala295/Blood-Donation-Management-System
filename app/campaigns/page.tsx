"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Countdown } from "@/components/countdown"

type AuthState = { token?: string; user?: { sub?: string } }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function parseJwtSub(token?: string): string | null {
  if (!token) return null
  try {
    const base = token.split(".")[1]
    const json = JSON.parse(atob(base))
    return json.sub || null
  } catch {
    return null
  }
}

export default function CampaignsPage() {
  const { data, mutate } = useSWR("/api/campaigns", fetcher, { refreshInterval: 15000 })
  const list = useMemo(() => data?.campaigns || [], [data])

  const [auth, setAuth] = useState<AuthState | null>(null)
  const [creatorSub, setCreatorSub] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) {
      const a = JSON.parse(raw)
      setAuth(a)
      setCreatorSub(parseJwtSub(a.token))
    }
  }, [])

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    points: 10,
    imageUrl: "",
    durationDays: 7,
  })
  const [editId, setEditId] = useState<string | null>(null)

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault()
    if (!auth?.token) return alert("Please login")
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: "", date: "", location: "", points: 10, imageUrl: "", durationDays: 7 })
      mutate()
    } else {
      alert("Failed to create")
    }
  }

  async function joinCampaign(id: string) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/campaigns/${id}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      mutate()
      alert("Joined campaign!")
    } else {
      alert("Failed to join")
    }
  }

  async function deleteCampaign(id: string) {
    if (!auth?.token) return alert("Please login")
    if (!confirm("Delete this campaign?")) return
    await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    mutate()
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">Campaigns</h1>

        {/* Create Campaign Form */}
        <div className="mb-10 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Create a Campaign</h2>
          <form onSubmit={createCampaign} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="e.g., Blood Drive at City Hospital"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="e.g., Hyderabad Red Cross Center"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reward Points</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Banner (Image URL)</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="https://example.com/banner.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                min={1}
                max={365}
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700">
                Create Campaign
              </button>
            </div>
          </form>
        </div>

        {/* Campaign List */}
        <div className="grid gap-6 md:grid-cols-2">
          {list.length === 0 && (
            <div className="col-span-2 rounded-lg border bg-gray-50 p-10 text-center text-gray-600">
              No campaigns yet. Be the first to create one!
            </div>
          )}

          {list.map((c: any) => {
            const isOwner = creatorSub && c.creatorId === creatorSub
            return (
              <div
                key={c.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={c.imageUrl || "/placeholder.svg?height=200&width=400&text=Campaign"}
                  alt={c.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(c.date).toLocaleString()} • {c.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-emerald-600">{c.points} pts</span>
                      <div className="text-xs text-gray-500">
                        Ends in: <Countdown iso={c.endsAt} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                      onClick={() => joinCampaign(c.id)}
                    >
                      Join
                    </button>
                    {isOwner && (
                      <>
                        <button
                          className="rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-200"
                          onClick={() => setEditId(c.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-200"
                          onClick={() => deleteCampaign(c.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <Footer />
    </main>
  )
}
