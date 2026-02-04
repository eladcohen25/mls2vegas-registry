'use client'

import { useEffect, useState } from 'react'

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (100vh)
      const heroHeight = window.innerHeight
      setIsVisible(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    const formSection = document.getElementById('registry-form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary-100 bg-white/95 p-4 backdrop-blur-sm md:hidden sticky-cta-enter">
      <button
        onClick={scrollToForm}
        className="btn-primary w-full text-sm"
      >
        Support the MLS Pathway
      </button>
    </div>
  )
}
