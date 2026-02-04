import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Disclaimer | MLS to Vegas',
  description: 'Important disclaimer about the MLS to Vegas community initiative.',
}

export default function DisclaimerPage() {
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

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <h1 className="text-3xl font-semibold text-primary-900 md:text-4xl">
            Disclaimer
          </h1>

          <div className="mt-12 space-y-6 text-primary-700 leading-relaxed">
            <p>
              MLS to Vegas is an independent, community-led initiative focused on demonstrating public interest and support for professional soccer development in Southern Nevada.
            </p>

            <p>
              MLS to Vegas is not affiliated with Major League Soccer (MLS), MLS Next Pro, or any associated league, club, or governing body.
            </p>

            <p>
              No professional franchise, expansion team, or league approval has been granted at this time. Participation, registration, and community support do not guarantee the establishment of a professional team in Las Vegas.
            </p>

            <p>
              Our current objective is to advocate for MLS Next Pro consideration by 2028. This goal is aspirational and subject to league review, market conditions, and independent decision-making by relevant organizations.
            </p>

            <p>
              All information collected is used solely for market validation and community interest analysis.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
