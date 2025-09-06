import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions, partnership ideas, or need support? We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="mx-auto max-w-5xl px-4 py-12 grid gap-12 md:grid-cols-2">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
          <p className="text-gray-600">
            Reach out to us directly through email, phone, or visit our office.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-red-600" />
              <span className="text-gray-700">support@bloodconnect.example</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-red-600" />
              <span className="text-gray-700">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-red-600" />
              <span className="text-gray-700">New Delhi, India</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
          <form className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                className="h-11 w-full rounded border px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                className="h-11 w-full rounded border px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="min-h-32 w-full rounded border px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="How can we help?"
              />
            </div>
            <button
              className="h-11 w-full rounded bg-red-600 px-4 text-white hover:bg-red-700 transition"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
