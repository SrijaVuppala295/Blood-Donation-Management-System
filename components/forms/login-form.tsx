"use client"
import { useState } from "react"
import type React from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Unexpected response from server. Please try again later.")
      }

      if (!res.ok) throw new Error(data.error || "Login failed")
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
      <h2 className="text-2xl font-semibold text-gray-900 text-center">Sign In</h2>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          className="h-12 rounded border px-3 focus:ring-2 focus:ring-red-600 focus:outline-none"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        disabled={loading}
        className="w-full h-12 rounded bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 transition"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
