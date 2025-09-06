"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setShowConfirmation(true)
        setFormData({ name: "", email: "", message: "" })
      } else {
        setError(data.error || "Failed to send message")
      }
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-3 text-3xl font-semibold text-gray-900">Contact Us</h1>
        <p className="mb-6 leading-relaxed text-gray-700">
          For partnerships and campaign inquiries, contact our team at support@bloodconnect.example.
        </p>

        {showConfirmation && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="h-11 rounded border px-3"
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="h-11 rounded border px-3"
            placeholder="Your email"
            type="email"
            required
            disabled={isSubmitting}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="min-h-28 rounded border px-3 py-2"
            placeholder="How can we help?"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-fit rounded bg-red-600 px-4 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  )
}
