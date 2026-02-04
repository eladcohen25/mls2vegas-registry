'use client'

import { useEffect, useState } from 'react'

interface Quote {
  text: string
  role: string
}

const PLACEHOLDER_QUOTES: Quote[] = [
  { text: "I want my child to have a real pathway to MLS.", role: "Parent" },
  { text: "We need elite development here in Vegas.", role: "Coach" },
  { text: "Vegas deserves top-level soccer infrastructure.", role: "Fan" },
  { text: "This could change everything for youth soccer in Southern Nevada.", role: "Parent" },
  { text: "Our kids shouldn't have to leave the state to pursue their dreams.", role: "Parent" },
  { text: "An MLS pathway would transform our soccer community.", role: "Coach" },
  { text: "Las Vegas is ready for this. The support is real.", role: "Fan" },
  { text: "My son dreams of playing professional soccer. This gives him hope.", role: "Parent" },
]

export default function CommunityQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(PLACEHOLDER_QUOTES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Fetch real quotes from API
    async function fetchQuotes() {
      try {
        const response = await fetch('/api/quotes')
        if (response.ok) {
          const data = await response.json()
          if (data.quotes && data.quotes.length > 0) {
            setQuotes(data.quotes)
          }
        }
      } catch (error) {
        // Use placeholder quotes on error
        console.error('Failed to fetch quotes:', error)
      }
    }

    fetchQuotes()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [quotes.length])

  const currentQuote = quotes[currentIndex]

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="flex justify-center">
        <svg className="h-10 w-10 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      
      <div className="mt-6 min-h-[120px]">
        <blockquote
          className={`text-center transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="text-xl text-primary-800 md:text-2xl">
            "{currentQuote.text}"
          </p>
          <footer className="mt-4 text-sm text-primary-500">
            — {currentQuote.role}, Las Vegas
          </footer>
        </blockquote>
      </div>

      {/* Quote indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {quotes.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsAnimating(false)
              }, 300)
            }}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex % 5 ? 'bg-navy' : 'bg-primary-200'
            }`}
            aria-label={`View quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
