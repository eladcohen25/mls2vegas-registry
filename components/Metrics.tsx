'use client'

import { useEffect, useRef, useState } from 'react'

function formatNumber(num: number): string {
  return num.toLocaleString()
}

type RegistrationStats = {
  supportersCount: number
  youthParentsCount: number
  businessesCount: number
}

interface MetricCardProps {
  value: number | null
  label: string
  description: string
}

function MetricCard({ value, label, description }: MetricCardProps) {
  return (
    <div className="metric-card text-center py-8 md:py-10">
      <div 
        className="counter-value text-5xl font-bold text-navy md:text-6xl lg:text-7xl tracking-tight transition-all duration-300"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
      >
        {value === null ? '—' : formatNumber(value)}
      </div>
      <div className="mt-4 text-sm font-semibold text-primary-800 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-xs text-primary-500">
        {description}
      </div>
    </div>
  )
}

interface MetricsProps {
  variant?: 'default' | 'compact'
}

export default function Metrics({ variant = 'default' }: MetricsProps) {
  const [stats, setStats] = useState<RegistrationStats | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const resyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/registrations/stats', { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as RegistrationStats
      if (
        typeof data.supportersCount === 'number' &&
        typeof data.youthParentsCount === 'number' &&
        typeof data.businessesCount === 'number'
      ) {
        setStats(data)
        setLastUpdated(new Date())
      }
    } catch {
      // keep last known stats
    }
  }

  useEffect(() => {
    fetchStats()

    const YOUTH_ROLES = new Set(['player', 'parent', 'youth_player', 'youth_parent'])

    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ role?: string; submission_type?: string }>
      const role = custom.detail?.role
      const submissionType = custom.detail?.submission_type

      // Optimistic update (no API call)
      if (submissionType === 'community_registry') {
        setStats((prev) => {
          if (!prev) return prev
          const next = {
            supportersCount: prev.supportersCount + 1,
            youthParentsCount:
              prev.youthParentsCount + (role && YOUTH_ROLES.has(role) ? 1 : 0),
            businessesCount: prev.businessesCount + (role === 'business_owner' ? 1 : 0),
          }
          setLastUpdated(new Date())
          return next
        })
      }

      // Debounced resync after 3s (avoid overload on rapid submissions)
      if (resyncTimeoutRef.current) return
      resyncTimeoutRef.current = setTimeout(async () => {
        resyncTimeoutRef.current = null
        await fetchStats()
      }, 3000)
    }

    window.addEventListener('mls2vegas:registrations:updated', handler as EventListener)
    return () => {
      window.removeEventListener('mls2vegas:registrations:updated', handler as EventListener)
      if (resyncTimeoutRef.current) {
        clearTimeout(resyncTimeoutRef.current)
        resyncTimeoutRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        <div className="text-center">
          <div className="counter-value text-3xl font-bold text-navy md:text-4xl tracking-tight">
            {stats ? formatNumber(stats.supportersCount) : '—'}
          </div>
          <div className="mt-1 text-xs text-primary-600 font-medium">Supporters</div>
        </div>
        <div className="text-center">
          <div className="counter-value text-3xl font-bold text-navy md:text-4xl tracking-tight">
            {stats ? formatNumber(stats.youthParentsCount) : '—'}
          </div>
          <div className="mt-1 text-xs text-primary-600 font-medium">Youth</div>
        </div>
        <div className="text-center">
          <div className="counter-value text-3xl font-bold text-navy md:text-4xl tracking-tight">
            {stats ? formatNumber(stats.businessesCount) : '—'}
          </div>
          <div className="mt-1 text-xs text-primary-600 font-medium">Businesses</div>
        </div>
      </div>
    )
  }

  return (
    <section id="metrics" className="bg-primary-50/70 py-20 md:py-28">
      <div className="container-wide">
        {/* Editorial Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12 bg-primary-300/60" />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-primary-400 uppercase">
            Community Support
          </span>
          <div className="h-px w-12 bg-primary-300/60" />
        </div>

        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary-900 md:text-3xl tracking-tight">
            Community Support Dashboard
          </h2>
          <p className="mt-3 text-sm text-primary-500 max-w-lg mx-auto">
            Real-time data from verified community members supporting MLS-aligned development.
          </p>
        </div>

        {/* Metrics Container */}
        <div className="mt-12 md:mt-16">
          <div className="relative">
            {/* Subtle background strip */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80 rounded-2xl" />
            
            <div className="relative grid gap-0 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-100">
              <MetricCard
                value={stats ? stats.supportersCount : null}
                label="Registered Supporters"
                description="Community members committed to the pathway"
              />
              <MetricCard
                value={stats ? stats.youthParentsCount : null}
                label="Youth Players & Parents"
                description="Families invested in development"
              />
              <MetricCard
                value={stats ? stats.businessesCount : null}
                label="Registered Businesses"
                description="Local organizations ready to partner"
              />
            </div>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-primary-600">LIVE</span>
            <span className="text-xs text-primary-400">•</span>
            <span className="text-xs text-primary-500">
              Last updated: {lastUpdated ? lastUpdated.toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              }) : '—'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
