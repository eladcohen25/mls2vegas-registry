'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Wistia?: any
    _wq?: any[]
  }
}

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [wistiaVideo, setWistiaVideo] = useState<any>(null)

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Load Wistia E-v1 script
    const script1 = document.createElement('script')
    script1.src = 'https://fast.wistia.com/assets/external/E-v1.js'
    script1.async = true
    document.head.appendChild(script1)

    // Load media-specific script
    const script2 = document.createElement('script')
    script2.src = 'https://fast.wistia.com/embed/medias/0m48i4bbld.jsonp'
    script2.async = true
    document.head.appendChild(script2)

    // Initialize Wistia queue
    window._wq = window._wq || []
    
    window._wq.push({
      id: '0m48i4bbld',
      onReady: (video: any) => {
        setWistiaVideo(video)
        setIsVideoLoaded(true)
        // Autoplay muted
        video.mute()
        video.play()
      }
    })

    return () => {
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1)
      }
      if (script2.parentNode) {
        script2.parentNode.removeChild(script2)
      }
    }
  }, [])

  const toggleMute = () => {
    if (wistiaVideo) {
      if (isMuted) {
        wistiaVideo.unmute()
      } else {
        wistiaVideo.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  const scrollToForm = () => {
    const formSection = document.getElementById('registry-form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToMetrics = () => {
    const metricsSection = document.getElementById('metrics')
    if (metricsSection) {
      metricsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero-section relative min-h-screen w-full overflow-hidden">
      {/* Editorial Background */}
      <div className="absolute inset-0 hero-background" />
      
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 hero-grain opacity-[0.03]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 hero-vignette" />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16 md:pt-24 md:pb-24">

        {/* Video Container */}
        <div 
          className={`video-container relative w-[98%] max-w-[1150px] md:w-[80%] transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
          }`}
        >
          {/* Video Frame */}
          <div className="video-frame relative overflow-hidden rounded-[14px] md:rounded-[20px] shadow-2xl shadow-black/50">
            {/* Border overlay */}
            <div className="absolute inset-0 z-20 rounded-[14px] md:rounded-[20px] ring-1 ring-white/10 pointer-events-none" />
            
            {/* Aspect Ratio Container */}
            <div className="relative aspect-[16/9]">
              {/* Loading State */}
              <div 
                className={`absolute inset-0 bg-navy-dark flex items-center justify-center transition-opacity duration-500 ${
                  isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>

              {/* Wistia Video */}
              <div 
                className={`wistia_responsive_padding transition-opacity duration-700 ${
                  isVideoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  padding: '56.25% 0 0 0',
                  position: 'relative'
                }}
              >
                <div
                  className="wistia_responsive_wrapper"
                  style={{
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%'
                  }}
                >
                  <div
                    className="wistia_embed wistia_async_0m48i4bbld seo=true videoFoam=true"
                    style={{
                      height: '100%',
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    <div
                      className="wistia_swatch"
                      style={{
                        height: '100%',
                        left: 0,
                        opacity: 0,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: 0,
                        transition: 'opacity 200ms',
                        width: '100%'
                      }}
                    >
                      <img
                        src="https://fast.wistia.com/embed/medias/0m48i4bbld/swatch"
                        style={{
                          filter: 'blur(5px)',
                          height: '100%',
                          objectFit: 'contain',
                          width: '100%'
                        }}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10 pointer-events-none" />

              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-sm px-4 py-2 text-xs font-medium text-white/90 transition-all hover:bg-black/80 hover:text-white ${
                  isVideoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {isMuted ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span>Tap to unmute</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>Mute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div 
          className={`mt-6 max-w-[1150px] md:w-[78%] px-4 transition-all duration-700 delay-[300ms] ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-[8px] md:text-[10px] leading-snug text-white/25 text-center max-w-[560px] mx-auto">
            Legal Disclaimer: This video contains third-party video footage, trademarks, and copyrighted materials owned by the Vegas Golden Knights, Las Vegas Raiders, Major League Soccer (MLS), and their respective affiliates, licensors, and rights holders. Such materials are used solely for informational, educational, and promotional purposes. No affiliation, endorsement, sponsorship, or approval by the aforementioned organizations is expressed or implied. All rights remain the property of their respective owners.
          </p>
        </div>

        {/* Text Content Below Video */}
        <div className="mt-12 md:mt-16 max-w-[700px] text-center px-4">
          {/* Logo / Initiative Name */}
          <div 
            className={`transition-all duration-700 delay-[200ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-sm md:text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
              MLS to Vegas
            </span>
          </div>

          {/* Headline */}
          <h1 
            className={`mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl transition-all duration-700 delay-[350ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Building the MLS Pathway<br className="hidden sm:block" /> in Las Vegas
          </h1>

          {/* Subheadline */}
          <p 
            className={`mt-5 text-lg leading-relaxed text-white/60 md:text-lg md:leading-relaxed transition-all duration-700 delay-[500ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            A community-backed initiative to strengthen player development and MLS-aligned pathways in Southern Nevada.
          </p>

          {/* CTA */}
          <div 
            className={`mt-10 transition-all duration-700 delay-[650ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold text-navy tracking-wide transition-all hover:bg-white/90 hover:gap-4 rounded-sm"
            >
              Support the MLS Pathway
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            {/* Line 1 - Slightly larger, medium gray */}
            <p className="mt-10 text-sm text-white/50 max-w-lg mx-auto text-center">
              Your support helps demonstrate demand for elite development and long-term professional soccer in Las Vegas.
            </p>
            
            {/* Line 2 - Smaller, lighter gray */}
            <p className="mt-5 text-xs text-white/35 max-w-xl mx-auto text-center">
              Independent community initiative. No league approval or franchise has been granted.
            </p>
          </div>

          {/* Inline Disclaimer - subtle, above final link */}
          <div 
            className={`mt-10 transition-all duration-700 delay-[900ms] ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-[10px] text-white/30 text-center max-w-md mx-auto">
              Focused on MLS-aligned development pathways and infrastructure.
            </p>
          </div>

          {/* View Community Support (separated from disclaimers) */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={scrollToMetrics}
              className="mt-3 text-[11px] text-white/25 hover:text-white/40 transition-colors text-center"
            >
              View Community Support ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
