import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const YOUTH_ROLES = ['player', 'parent', 'youth_player', 'youth_parent'] as const
const BUSINESS_ROLE = 'business_owner' as const

function envNumber(name: string): number {
  const n = Number(process.env[name])
  return Number.isFinite(n) ? n : 0
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const supportersOffset = envNumber('SUPPORTERS_OFFSET')
    const youthParentsOffset = envNumber('YOUTH_PARENTS_OFFSET')
    const businessesOffset = envNumber('BUSINESSES_OFFSET')

    const base = () => supabase.from('registrations').select('*', { count: 'exact', head: true })

    const [supportersRes, youthRes, businessRes] = await Promise.all([
      base().eq('submission_type', 'community_registry'),
      base().eq('submission_type', 'community_registry').in('role', [...YOUTH_ROLES]),
      base().eq('submission_type', 'community_registry').eq('role', BUSINESS_ROLE),
    ])

    if (supportersRes.error || youthRes.error || businessRes.error) {
      return NextResponse.json({ error: 'Failed to load registration stats' }, { status: 500 })
    }

    const supportersCount = supportersOffset + (supportersRes.count ?? 0)
    const youthParentsCount = youthParentsOffset + (youthRes.count ?? 0)
    const businessesCount = businessesOffset + (businessRes.count ?? 0)

    return NextResponse.json(
      { supportersCount, youthParentsCount, businessesCount },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to load registration stats' }, { status: 500 })
  }
}

