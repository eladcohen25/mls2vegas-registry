import { NextResponse } from 'next/server'
import { getMetrics } from '@/lib/storage'

export async function GET() {
  try {
    const metrics = getMetrics()
    
    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Metrics error:', error)
    
    // Return fallback metrics on error
    return NextResponse.json({
      supporters: 847,
      youthPlayers: 312,
      businesses: 43,
      lastUpdated: new Date().toISOString(),
    })
  }
}
