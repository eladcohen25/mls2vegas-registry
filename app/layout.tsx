import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mlstovegas.com'),
  title: 'MLS to Vegas | Building the MLS Pathway in Las Vegas',
  description: 'A community-backed initiative to strengthen player development and MLS-aligned pathways in Southern Nevada. Join the registry to support elite development, facilities, and long-term MLS integration.',
  keywords: ['MLS', 'Las Vegas', 'soccer', 'youth development', 'MLS NEXT Pro', 'player pathway', 'Southern Nevada'],
  authors: [{ name: 'MLS to Vegas Initiative' }],
  openGraph: {
    title: 'MLS to Vegas | Building the MLS Pathway in Las Vegas',
    description: 'A community-backed initiative to strengthen player development and MLS-aligned pathways in Southern Nevada.',
    url: 'https://mlstovegas.com',
    siteName: 'MLS to Vegas',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MLS to Vegas - Building the MLS Pathway in Las Vegas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MLS to Vegas | Building the MLS Pathway in Las Vegas',
    description: 'A community-backed initiative to strengthen player development and MLS-aligned pathways in Southern Nevada.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
