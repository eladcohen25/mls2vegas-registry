'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy/95 backdrop-blur-md shadow-lg shadow-black/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="relative flex items-center justify-center h-16 md:h-20">
          {/* Instagram - Absolute left */}
          <a
            href="https://www.instagram.com/mls2vegas"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-0 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Follow us on Instagram"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Logo - Centered */}
          <Link 
            href="/" 
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Logo/MLS 2 VEGAS LOGO.png"
              alt="MLS to Vegas"
              width={240}
              height={80}
              className="h-14 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Navigation - Absolute right */}
          <nav className="absolute right-0 hidden md:flex items-center gap-1 md:gap-2">
            <button
              onClick={() => scrollToSection('metrics')}
              className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors rounded-sm hover:bg-white/10"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection('registry-form')}
              className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors rounded-sm hover:bg-white/10"
            >
              Support
            </button>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors rounded-sm hover:bg-white/10"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="absolute right-0 inline-flex items-center justify-center p-2 text-white/80 hover:text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="mt-2 rounded-sm border border-white/10 bg-navy/95 backdrop-blur-md p-3">
              <button
                onClick={() => {
                  scrollToSection('metrics')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  scrollToSection('registry-form')
                  setIsMenuOpen(false)
                }}
                className="mt-1 block w-full text-left px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-sm"
              >
                Support
              </button>
              <Link
                href="/contact"
                className="mt-1 block w-full text-left px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
