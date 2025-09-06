"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()

  // Simulated auth check (replace with real logic, e.g. from context or cookies)
  const isLoggedIn = false // 👉 replace with actual check

  const handleJoinClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard") // if already logged in
    } else {
      router.push("/signup") // if not logged in
    }
  }

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Donate Blood. Save Lives. Build Community.
            </h1>
            <p className="text-pretty leading-relaxed text-gray-600 md:text-lg">
              Join time-bound campaigns, respond to emergency requests, and earn recognition for your impact.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleJoinClick}
                className="rounded-lg bg-red-600 px-6 py-3 text-white shadow-md transition hover:scale-105 hover:bg-red-700"
              >
                Join Today
              </button>
              <Link
                href="/campaigns"
                className="rounded-lg border px-6 py-3 text-gray-800 shadow-sm transition hover:scale-105 hover:border-red-600 hover:text-red-700"
              >
                Explore Campaigns
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Image
              src="/hero-blood-donation.png"
              alt="Volunteers participating in a blood donation campaign"
              className="rounded-xl border shadow-lg"
              width={960}
              height={720}
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Verified Donors",
              desc: "Filter by blood group and pincode to find the right donor quickly.",
            },
            {
              title: "Time-bound Requests",
              desc: "Requests auto-expire with clear timers to avoid stale data.",
            },
            {
              title: "Points & Badges",
              desc: "Contributions are rewarded and showcased in your profile.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border bg-white p-6 shadow-sm transition"
            >
              <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-red-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Our Impact So Far</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { number: "10K+", label: "Donors Registered" },
              { number: "5K+", label: "Blood Units Saved" },
              { number: "500+", label: "Campaigns Organized" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <p className="text-4xl font-bold text-red-600">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">How It Works</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            { step: "1", title: "Sign Up", desc: "Create your account and verify your details." },
            { step: "2", title: "Join or Request", desc: "Participate in campaigns or request donors instantly." },
            { step: "3", title: "Save Lives", desc: "Make a real difference in your community." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-xl border bg-white p-6 text-center shadow-md transition"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to Save a Life?</h2>
        <p className="mt-3 text-lg">Join our community of heroes and start donating today.</p>
        <div className="mt-6">
          <button
            onClick={handleJoinClick}
            className="rounded-lg bg-white px-6 py-3 font-medium text-red-600 shadow-md transition hover:scale-105 hover:bg-gray-100"
          >
            {isLoggedIn ? "Go to Dashboard" : "Join Today"}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
