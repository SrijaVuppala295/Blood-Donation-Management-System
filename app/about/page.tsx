import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            About <span className="text-red-600">BloodConnect</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            We are on a mission to make blood donation faster, safer, and more rewarding. By connecting donors and
            recipients directly, we empower communities to save lives every day.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">24/7</div>
            <p className="mt-2 text-sm text-gray-600">Emergency support anytime, anywhere</p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">Minutes</div>
            <p className="mt-2 text-sm text-gray-600">to match volunteers with requests</p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">10k+</div>
            <p className="mt-2 text-sm text-gray-600">Lives impacted through our platform</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p className="leading-relaxed text-gray-700">
              To build a reliable and accessible blood donation network where no request goes unanswered. We believe in
              empowering individuals to step forward and create impact through timely donations.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Vision</h2>
            <p className="leading-relaxed text-gray-700">
              A future where every community is self-sufficient in blood supply, driven by compassion, technology, and
              collaboration. Together, we aim to eliminate shortages and save countless lives.
            </p>
          </div>
        </div>
      </section>

      {/* Team / Values */}
   {/* Core Values Section */}
<section className="mx-auto max-w-6xl px-4 py-20">
  <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
    Our Core Values
  </h2>
  <div className="grid gap-10 md:grid-cols-3">
    {/* Value Card */}
    <div className="rounded-2xl border bg-white p-8 shadow-sm text-center transition hover:shadow-lg hover:-translate-y-1">
      <Image
        src="/compassion.avif"
        alt="Compassion"
        width={250}
        height={200}
        className="mx-auto mb-5 h-40 w-auto object-contain"
      />
      <h3 className="text-xl font-semibold text-gray-900">Compassion</h3>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        Every drop of blood is a symbol of kindness and humanity. We value
        empathy above all.
      </p>
    </div>

    {/* Value Card */}
    <div className="rounded-2xl border bg-white p-8 shadow-sm text-center transition hover:shadow-lg hover:-translate-y-1">
      <Image
        src="/trust.webp"
        alt="Trust"
        width={250}
        height={200}
        className="mx-auto mb-5 h-40 w-auto object-contain"
      />
      <h3 className="text-xl font-semibold text-gray-900">Trust</h3>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        A transparent and reliable system ensures safety for both donors and
        recipients.
      </p>
    </div>

    {/* Value Card */}
    <div className="rounded-2xl border bg-white p-8 shadow-sm text-center transition hover:shadow-lg hover:-translate-y-1">
      <Image
        src="/community.avif"
        alt="Community"
        width={250}
        height={200}
        className="mx-auto mb-5 h-40 w-auto object-contain"
      />
      <h3 className="text-xl font-semibold text-gray-900">Community</h3>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        Together, we create a culture of giving and mutual support that
        strengthens society.
      </p>
    </div>
  </div>
</section>
 


      <Footer />
    </main>
  )
}
