import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const DEFAULT_PAGE_SIZE = 25

function parseDateStart(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function parseDateEnd(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

function escapeCsv(value: unknown) {
  const str = value === null || value === undefined ? '' : String(value)
  const escaped = str.replace(/"/g, '""')
  return `"${escaped}"`
}

export async function GET(request: NextRequest) {
  const isAuthed = request.cookies.get('admin_auth')?.value === '1'
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || ''
  const search = searchParams.get('search') || ''
  const start = searchParams.get('start') || ''
  const end = searchParams.get('end') || ''
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE)))
  const format = (searchParams.get('format') || '').toLowerCase()

  const supabase = createSupabaseServerClient()

  let query = supabase
    .from('registrations')
    .select(
      'id,created_at,full_name,email,zip_code,role,business_name,youth_club,interested_in_tickets,interested_in_partnership,submission_type,support_reason',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  if (role) {
    query = query.eq('role', role)
  }

  const startIso = start ? parseDateStart(start) : null
  if (startIso) {
    query = query.gte('created_at', startIso)
  }

  const endIso = end ? parseDateEnd(end) : null
  if (endIso) {
    query = query.lte('created_at', endIso)
  }

  if (search) {
    const term = search.replace(/%/g, '\\%').replace(/,/g, '\\,')
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`)
  }

  if (format === 'csv') {
    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: 'Failed to load registrations' }, { status: 500 })
    }

    const headers = [
      'created_at',
      'full_name',
      'email',
      'zip_code',
      'role',
      'business_name',
      'youth_club',
      'interested_in_tickets',
      'interested_in_partnership',
      'submission_type',
      'support_reason',
    ]

    const rows = (data || []).map((row) =>
      headers.map((key) => escapeCsv((row as Record<string, unknown>)[key])).join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="registrations.csv"',
        'Cache-Control': 'no-store',
      },
    })
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    return NextResponse.json({ error: 'Failed to load registrations' }, { status: 500 })
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    pageSize,
  })
}

