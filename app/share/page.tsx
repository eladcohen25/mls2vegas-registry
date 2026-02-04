import { Metadata } from 'next'
import Link from 'next/link'
import Metrics from '@/components/Metrics'
import ShareButtons from '@/components/ShareButtons'
import CommunityQuotes from '@/components/CommunityQuotes'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Thank You | MLS to Vegas',
  description: 'Thank you for supporting the MLS Pathway in Las Vegas. Help grow the movement by sharing with your community.',
}

export default function SharePage() {
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

      {/* Thank You Section */}
      <section className="py-20 md:py-28">
        <div className="container-narrow text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="mt-6 text-3xl font-semibold text-primary-900 md:text-4xl">
            Thank you for supporting the MLS Pathway in Las Vegas.
          </h1>
          <p className="mt-4 text-lg text-primary-600">
            Your registration has been recorded. Together, we're building the case for elite soccer development in Southern Nevada.
          </p>
        </div>
      </section>

      {/* Live Metrics */}
      <section className="border-y border-primary-100 bg-primary-50 py-16">
        <div className="container-wide">
          <h2 className="mb-10 text-center text-2xl font-semibold text-primary-900">
            Community Support Dashboard
          </h2>
          <Metrics variant="compact" />
        </div>
      </section>

      {/* Community Quotes */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <h2 className="mb-12 text-center text-2xl font-semibold text-primary-900">
            Voices from the Community
          </h2>
          <CommunityQuotes />
        </div>
      </section>

      {/* Share Section */}
      <section className="border-t border-primary-100 bg-white py-16">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-semibold text-primary-900">
            Help Grow the Movement
          </h2>
          <p className="mt-3 text-primary-600">
            Share this initiative with your network to demonstrate the depth of community support.
          </p>
          
          <div className="mt-8">
            <ShareButtons />
          </div>
        </div>
      </section>

      {/* Share Image Placeholder */}
      <section className="py-16">
        <div className="container-narrow">
          <div className="rounded-sm border-2 border-dashed border-primary-200 bg-primary-50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-primary-500">
              Official share graphics coming soon.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
