import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | MLS to Vegas',
  description: 'Privacy policy for the MLS to Vegas community registry and initiative.',
}

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-primary-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="mt-12 space-y-8 text-primary-700">
            <section>
              <h2 className="text-xl font-semibold text-primary-900">Information We Collect</h2>
              <p className="mt-3">
                When you register your support through our platform, we collect the following information:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Full name</li>
                <li>Email address</li>
                <li>Zip code</li>
                <li>Role (Parent, Player, Coach, Fan, Business Owner, Other)</li>
                <li>Optional: Youth club or program affiliation</li>
                <li>Optional: Interest in season tickets or business partnership</li>
                <li>Optional: Comments or testimonials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">How We Use Your Information</h2>
              <p className="mt-3">
                Your information is used solely for the following purposes:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Market Validation:</strong> Demonstrating community demand for MLS-aligned development in Las Vegas to relevant stakeholders.</li>
                <li><strong>Aggregate Reporting:</strong> Creating anonymized statistics about community support.</li>
                <li><strong>Community Updates:</strong> Sending occasional updates about the initiative (you can unsubscribe at any time).</li>
                <li><strong>League Evaluation:</strong> Providing evidence of community interest to MLS and related organizations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">Data Protection</h2>
              <p className="mt-3">
                We take the security of your personal information seriously. Your data is:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Stored securely using industry-standard practices</li>
                <li>Never sold to third parties</li>
                <li>Only shared in aggregate, anonymized form for reporting purposes</li>
                <li>Accessible only to authorized team members</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">Your Rights</h2>
              <p className="mt-3">
                You have the right to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw your support at any time</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@mlstovegas.com" className="text-navy underline">
                  privacy@mlstovegas.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">Cookies and Analytics</h2>
              <p className="mt-3">
                This website uses minimal cookies necessary for functionality. We may use privacy-respecting analytics to understand how visitors interact with our site. No personal data is shared with analytics providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">Contact Us</h2>
              <p className="mt-3">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-3">
                <a href="mailto:info@mlstovegas.com" className="text-navy underline">
                  info@mlstovegas.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-900">Changes to This Policy</h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. We will notify registered supporters of any material changes via email.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
