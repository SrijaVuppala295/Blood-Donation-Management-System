import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo2.jpeg" alt="BloodConnect logo" width={32} height={32} className="h-8 w-8 rounded" />
              <span className="text-lg font-bold text-red-600">BloodConnect</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Donate Blood. Save Lives. Build Community.  
              Join campaigns, respond to emergencies, and earn recognition.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="transition hover:text-red-600" href="/campaigns">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-red-600" href="/donor/emergency">
                  Emergency
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-red-600" href="/recipient/find-donors">
                  Find Donors
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="transition hover:text-red-600" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-red-600" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-red-600" href="/profile">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">Get Started</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="transition hover:text-red-600" href="/signup">
                  Create Account
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-red-600" href="/login">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-6 text-sm text-gray-600 md:flex-row">
          <p>&copy; {new Date().getFullYear()} BloodConnect. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank" className="transition hover:text-red-600">
              <Facebook size={18} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="transition hover:text-red-600">
              <Twitter size={18} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="transition hover:text-red-600">
              <Instagram size={18} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="transition hover:text-red-600">
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
