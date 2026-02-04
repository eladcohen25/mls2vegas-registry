import { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Partnership & Investment Inquiries | MLS to Vegas',
  description: 'For organizations and individuals interested in supporting MLS-aligned development in Las Vegas through investment, ownership, or partnership.',
}

export default function ContactPage() {
  return (
    <main>
      {/* Header */}
      <header className="border-b border-primary-100 bg-white">
        <div className="container-wide flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold text-navy">
            MLS to Vegas
          </Link>
          <Link href="/" className="text-sm text-primary-600 hover:text-navy transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-primary-900 md:text-4xl">
              Partnership & Investment Inquiries
            </h1>
            <p className="mt-4 text-lg text-primary-600">
              This initiative welcomes inquiries from organizations and individuals interested in supporting MLS-aligned development in Las Vegas.
            </p>
          </div>

          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="border-t border-primary-100 bg-primary-50 py-16">
        <div className="container-narrow text-center">
          <h2 className="text-xl font-semibold text-primary-900">
            Areas of Interest
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-sm bg-white p-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy/10">
                <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-primary-900">Investment</h3>
              <p className="mt-2 text-sm text-primary-600">
                Capital investment in development infrastructure and pathway programs.
              </p>
            </div>

            <div className="rounded-sm bg-white p-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy/10">
                <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-primary-900">Ownership</h3>
              <p className="mt-2 text-sm text-primary-600">
                Equity participation in MLS-aligned development initiatives.
              </p>
            </div>

            <div className="rounded-sm bg-white p-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy/10">
                <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-primary-900">Partnership</h3>
              <p className="mt-2 text-sm text-primary-600">
                Corporate sponsorship and strategic partnership opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
