"use client"
import Navbar from "@/components/navbar"
import type React from "react"
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

function formatRemaining(to?: string | Date) {
  if (!to) return "—"
  const end = new Date(to).getTime()
  const now = Date.now()
  let diff = Math.max(0, end - now)
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  diff -= days * 24 * 60 * 60 * 1000
  const hours = Math.floor(diff / (60 * 60 * 1000))
  diff -= hours * 60 * 60 * 1000
  const mins = Math.floor(diff / (60 * 1000))
  return `${days}d ${hours}h ${mins}m`
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
      const d = await res.json().catch(() => ({}))
      alert(d.error ? JSON.stringify(d.error) : "Failed to create")
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
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return alert(d.error || "Delete failed")
    }
    mutate()
  }

  async function saveEdit(id: string, payload: any) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return alert(d.error || "Update failed")
    }
    setEditId(null)
    mutate()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Navbar />
      
      <section className="mx-auto max-w-7xl px-4 py-12">
        {/* Header with enhanced styling */}
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Blood Donation Campaigns
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our life-saving campaigns and make a difference in your community. Every donation counts.
          </p>
        </div>

        {/* Enhanced form with glassmorphism */}
        <div className="mb-12 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">+</span>
            </span>
            Create New Campaign
          </h2>
          
          <form onSubmit={createCampaign} className="grid gap-6 lg:grid-cols-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors placeholder-gray-400"
                placeholder="e.g., Blood Drive at City Hospital"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors"
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors placeholder-gray-400"
                placeholder="e.g., Hyderabad Red Cross Center"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reward Points</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors"
                type="number"
                min={0}
                max={1000}
                placeholder="10"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              />
            </div>
            
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors placeholder-gray-400"
                placeholder="https://example.com/banner.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
              <input
                className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 focus:border-red-500 focus:outline-none transition-colors"
                type="number"
                min={1}
                max={365}
                placeholder="7"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <button className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:from-red-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Create Campaign
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced campaign grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {list.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-3xl">📋</span>
              </div>
              <p className="text-gray-500 text-lg">No campaigns available yet.</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to create a life-saving campaign!</p>
            </div>
          )}
          
          {list.map((c: any) => {
            const isOwner = creatorSub && c.creatorId === creatorSub
            return (
              <div key={c.id} className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center">
                      <span className="text-red-400 text-6xl">🩸</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-red-600 font-bold px-3 py-1 rounded-full text-sm shadow-md">
                      {c.points} pts
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{c.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="text-red-500">📅</span>
                        {new Date(c.date).toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-red-500">📍</span>
                        {c.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Campaign ends in:</div>
                    <div className="font-mono font-bold text-red-600">
                      <Countdown iso={c.endsAt} />
                    </div>
                  </div>

                  {editId === c.id && isOwner ? (
                    <div className="space-y-3">
                      <input
                        className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                        defaultValue={c.title}
                        placeholder="Campaign title"
                        onChange={(e) => (c.title = e.target.value)}
                      />
                      <input
                        className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                        type="datetime-local"
                        defaultValue={c.date?.slice(0, 16)}
                        onChange={(e) => (c.date = e.target.value)}
                      />
                      <input
                        className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                        defaultValue={c.location}
                        placeholder="Location"
                        onChange={(e) => (c.location = e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                          type="number"
                          min={0}
                          max={1000}
                          defaultValue={c.points}
                          placeholder="Points"
                          onChange={(e) => (c.points = Number(e.target.value))}
                        />
                        <input
                          className="h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                          type="number"
                          min={1}
                          max={365}
                          placeholder="Days"
                          onChange={(e) => (c.durationDays = Number(e.target.value))}
                        />
                      </div>
                      <input
                        className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 focus:border-red-500 focus:outline-none transition-colors text-sm"
                        placeholder="Image URL"
                        defaultValue={c.imageUrl || ""}
                        onChange={(e) => (c.imageUrl = e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 h-10 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors" 
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex-1 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                          onClick={() =>
                            saveEdit(c.id, {
                              title: c.title,
                              date: c.date,
                              location: c.location,
                              points: c.points,
                              imageUrl: c.imageUrl,
                              durationDays: c.durationDays,
                            })
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:from-red-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => joinCampaign(c.id)}
                      >
                        Join Campaign
                      </button>
                      {isOwner && (
                        <div className="flex gap-1">
                          <button
                            className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                            onClick={() => setEditId(c.id)}
                            title="Edit campaign"
                          >
                            ✏️
                          </button>
                          <button
                            className="w-12 h-12 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                            onClick={() => deleteCampaign(c.id)}
                            title="Delete campaign"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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