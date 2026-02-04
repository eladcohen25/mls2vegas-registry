import { NextRequest, NextResponse } from 'next/server'
import { saveRegistration, isEmailRegistered } from '@/lib/storage'
import { sendRegistrationNotification } from '@/lib/email'
import { sendToGoogleSheets } from '@/lib/googleSheets'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

interface RegistrationBody {
  fullName: string
  email: string
  zipCode: string
  role: string
  businessName?: string
  youthClub?: string
  interestedInTickets?: string
  interestedInPartnership?: string
  comment?: string
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateZipCode(zipCode: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zipCode)
}

const VALID_ROLES = ['parent', 'player', 'coach', 'fan', 'business_owner', 'other']

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`register:${clientId}`)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000)),
          }
        }
      )
    }

    const body: RegistrationBody = await request.json()

    // Validate required fields
    if (!body.fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (!body.zipCode?.trim()) {
      return NextResponse.json(
        { error: 'Zip code is required' },
        { status: 400 }
      )
    }

    if (!validateZipCode(body.zipCode)) {
      return NextResponse.json(
        { error: 'Please provide a valid zip code' },
        { status: 400 }
      )
    }

    if (!body.role || !VALID_ROLES.includes(body.role)) {
      return NextResponse.json(
        { error: 'Please select a valid role' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    if (isEmailRegistered(body.email)) {
      return NextResponse.json(
        { error: 'This email has already been registered' },
        { status: 409 }
      )
    }

    // Save registration
    const registration = saveRegistration({
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      zipCode: body.zipCode.trim(),
      role: body.role,
      businessName: body.businessName?.trim(),
      youthClub: body.youthClub?.trim(),
      interestedInTickets: body.interestedInTickets,
      interestedInPartnership: body.interestedInPartnership,
      comment: body.comment?.trim(),
    })

    // Send to Google Sheets (non-blocking)
    sendToGoogleSheets({
      fullName: registration.fullName,
      email: registration.email,
      zipCode: registration.zipCode,
      role: registration.role,
      businessName: registration.businessName,
      youthClub: registration.youthClub,
      interestedInTickets: registration.interestedInTickets,
      interestedInPartnership: registration.interestedInPartnership,
      comment: registration.comment,
    }, 'registration').catch(console.error)

    // Send email notification (non-blocking)
    sendRegistrationNotification(registration).catch(console.error)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registration.id 
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        }
      }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
