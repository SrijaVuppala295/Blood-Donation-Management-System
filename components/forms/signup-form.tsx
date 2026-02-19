"use client"
import { useState } from "react"
import type React from "react"

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    bloodGroup: "",
    pincode: "",
    mobile: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Unexpected response from server. Please try again later.")
      }

      if (!res.ok) throw new Error(data.error || "Signup failed")
      localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }))
      window.location.href = data.user.role === "donor" ? "/donor" : "/recipient/requests"
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-900 text-center">Create Account</h2>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter a strong password"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Blood Group (Donors)</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          placeholder="e.g., O+, A-"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Pincode</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          placeholder="123456"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Mobile</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          placeholder="+91 9876543210"
          required
        />
      </div>

      <button
        disabled={loading}
        className="w-full h-12 rounded bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 transition"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}
