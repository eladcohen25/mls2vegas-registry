import { NextResponse } from 'next/server'
import { getQuotes } from '@/lib/storage'

const PLACEHOLDER_QUOTES = [
  { text: "I want my child to have a real pathway to MLS.", role: "Parent" },
  { text: "We need elite development here in Vegas.", role: "Coach" },
  { text: "Vegas deserves top-level soccer infrastructure.", role: "Fan" },
  { text: "This could change everything for youth soccer in Southern Nevada.", role: "Parent" },
  { text: "Our kids shouldn't have to leave the state to pursue their dreams.", role: "Parent" },
  { text: "An MLS pathway would transform our soccer community.", role: "Coach" },
  { text: "Las Vegas is ready for this. The support is real.", role: "Fan" },
  { text: "My son dreams of playing professional soccer. This gives him hope.", role: "Parent" },
]

export async function GET() {
  try {
    const realQuotes = getQuotes()
    
    // Combine real quotes with placeholder quotes
    const quotes = realQuotes.length > 0 
      ? [...realQuotes, ...PLACEHOLDER_QUOTES.slice(0, Math.max(0, 8 - realQuotes.length))]
      : PLACEHOLDER_QUOTES
    
    return NextResponse.json({ quotes }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Quotes error:', error)
    
    // Return placeholder quotes on error
    return NextResponse.json({ quotes: PLACEHOLDER_QUOTES })
  }
}
