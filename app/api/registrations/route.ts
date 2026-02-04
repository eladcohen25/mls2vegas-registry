import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { sendToGoogleSheets } from '@/lib/googleSheets'

const VALID_ROLES = ['parent', 'player', 'coach', 'fan', 'business_owner', 'other']

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateZipCode(zipCode: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zipCode)
}

type RegistrationPayload = {
  full_name: string
  email: string
  zip_code: string
  role: string
  business_name?: string
  youth_club?: string
  interested_in_tickets?: string
  interested_in_partnership?: string
  support_reason?: string
  submission_type: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<RegistrationPayload> & {
      comment?: string
      support_reason?: string
    }

    // Required fields
    if (!body.full_name?.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!validateEmail(body.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (!body.zip_code?.trim()) {
      return NextResponse.json({ error: 'Zip code is required' }, { status: 400 })
    }
    if (!validateZipCode(body.zip_code)) {
      return NextResponse.json({ error: 'Please enter a valid zip code' }, { status: 400 })
    }
    if (!body.role || !VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: 'Please select a valid role' }, { status: 400 })
    }
    if (!body.submission_type?.trim()) {
      return NextResponse.json({ error: 'Submission type is required' }, { status: 400 })
    }

    // Conditional required field
    if (body.role === 'business_owner' && !body.business_name?.trim()) {
      return NextResponse.json({ error: 'Business name is required for business owners' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    const insertRow: RegistrationPayload = {
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      zip_code: body.zip_code.trim(),
      role: body.role,
      business_name: body.business_name?.trim() || undefined,
      youth_club: body.youth_club?.trim() || undefined,
      interested_in_tickets: body.interested_in_tickets || undefined,
      interested_in_partnership: body.interested_in_partnership || undefined,
      support_reason: body.support_reason?.trim() || undefined,
      submission_type: body.submission_type.trim(),
    }

    const { error } = await supabase.from('registrations').insert(insertRow)

    if (error) {
      // Surface a clean error message
      return NextResponse.json({ error: 'Failed to submit registration' }, { status: 500 })
    }

    // Keep existing Google Sheets submission (non-blocking)
    sendToGoogleSheets(
      {
        fullName: insertRow.full_name,
        email: insertRow.email,
        zipCode: insertRow.zip_code,
        role: insertRow.role,
        businessName: insertRow.business_name,
        youthClub: insertRow.youth_club,
        interestedInTickets: insertRow.interested_in_tickets,
        interestedInPartnership: insertRow.interested_in_partnership,
        comment: body.comment?.trim() || undefined,
        submissionType: insertRow.submission_type,
      },
      'registration'
    ).catch(console.error)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

