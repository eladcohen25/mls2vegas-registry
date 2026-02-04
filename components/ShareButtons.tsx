'use client'

import { useState } from 'react'

const SHARE_TEXT = 'I just joined the MLS to Vegas initiative to support MLS-aligned development in Las Vegas. Join the movement!'
const SHARE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mlstovegas.com'

export default function ShareButtons() {
  const [copied, setCopied] = useState(false)

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <button
        onClick={shareOnTwitter}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1DA1F2] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      <button
        onClick={shareOnFacebook}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Share on Facebook
      </button>

      <button
        onClick={copyLink}
        className="flex w-full items-center justify-center gap-2 rounded-sm border border-primary-200 bg-white px-6 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 sm:w-auto"
      >
        {copied ? (
          <>
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Link Copied!
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}
