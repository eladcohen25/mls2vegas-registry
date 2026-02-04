import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      {/* Disclaimer Banner */}
      <div className="border-b border-primary-100 bg-primary-50/50 py-4">
        <div className="container-wide">
          <p className="text-xs text-primary-500 text-center">
            Las Vegas is already home to professional soccer. This initiative focuses on elevating MLS-aligned development pathways and infrastructure.
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="container-wide">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold text-navy">MLS to Vegas</p>
              <p className="mt-1 text-sm text-primary-500">
                Building the MLS Pathway in Las Vegas
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-sm text-primary-600 md:flex-row md:gap-8">
              <Link href="/contact" className="hover:text-navy transition-colors">
                Partnership Inquiries
              </Link>
              <a
                href="mailto:info@mlstovegas.com"
                className="hover:text-navy transition-colors"
              >
                info@mlstovegas.com
              </a>
              <Link href="/privacy" className="hover:text-navy transition-colors">
                Privacy Policy
              </Link>
              <Link href="/disclaimer" className="hover:text-navy transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-primary-100 pt-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs text-primary-400">
                Data is used solely for market validation and reporting.
              </p>
              <p className="text-2xs text-primary-300">
                Prepared for league evaluation.
              </p>
              <p className="text-2xs text-primary-300">
                © {new Date().getFullYear()} MLS to Vegas Initiative. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
